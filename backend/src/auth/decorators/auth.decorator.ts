import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@/auth/auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { UserRole } from '@/users/entities/user.entity';

/**
 * Decorador combinado: verifica autenticación JWT y, opcionalmente, rol requerido.
 * Uso: @Auth() — solo requiere token válido.
 *      @Auth('admin') — requiere token válido + rol admin.
 */
export function Auth(...roles: UserRole[]) {
  const guards = [AuthGuard, RolesGuard];
  const decorators: MethodDecorator[] = [UseGuards(...guards)];

  if (roles.length > 0) {
    decorators.push(Roles(...roles));
  }

  return applyDecorators(...decorators);
}
