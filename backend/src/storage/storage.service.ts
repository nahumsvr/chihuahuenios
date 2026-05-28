import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, PutBucketPolicyCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly s3Client: S3Client;
  private readonly bucket: string;
  private readonly endpoint: string;
  private readonly logger = new Logger(StorageService.name);

  constructor(private readonly configService: ConfigService) {
    this.endpoint = this.configService.get<string>(
      'MINIO_ENDPOINT',
      'http://localhost:9000',
    );
    this.bucket = this.configService.get<string>(
      'MINIO_BUCKET_NAME',
      'identificaciones',
    );

    this.s3Client = new S3Client({
      endpoint: this.endpoint,
      region: 'us-east-1', // MinIO ignora la región, pero el SDK la requiere
      credentials: {
        accessKeyId: this.configService.get<string>(
          'MINIO_ACCESS_KEY',
          'minioadmin',
        ),
        secretAccessKey: this.configService.get<string>(
          'MINIO_SECRET_KEY',
          'minioadminsecret',
        ),
      },
      forcePathStyle: true, // Obligatorio para MinIO (usa path-style en vez de virtual-hosted)
    });
  }

  async onModuleInit() {
    try {
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: '*',
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${this.bucket}/perfiles/*`],
          },
        ],
      };

      await this.s3Client.send(
        new PutBucketPolicyCommand({
          Bucket: this.bucket,
          Policy: JSON.stringify(policy),
        }),
      );
      this.logger.log('Política de acceso público aplicada a la carpeta perfiles');
    } catch (error) {
      this.logger.warn('Aviso: No se pudo configurar la política pública del bucket. Si las imágenes no cargan, verifica los permisos.', error);
    }
  }

  /**
   * Sube un archivo a MinIO y retorna la URL pública.
   * @param file Archivo recibido vía Multer
   * @param folder Carpeta/prefijo dentro del bucket
   * @returns URL completa del archivo subido
   */
  async upload(file: Express.Multer.File, folder: string): Promise<string> {
    const extension = extname(file.originalname);
    const key = `${folder}/${uuidv4()}${extension}`;

    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      const fileUrl = `${this.endpoint}/${this.bucket}/${key}`;
      this.logger.log(`Archivo subido exitosamente: ${fileUrl}`);
      return fileUrl;
    } catch (error) {
      this.logger.error('Error al subir archivo a MinIO', error);
      throw new InternalServerErrorException(
        'Error al subir el archivo de identificación',
      );
    }
  }
}
