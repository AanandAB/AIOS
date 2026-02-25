import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  roles: string[];
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  roles?: string[];
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private users: User[] = [];

  constructor(private readonly jwtService: JwtService) {
    // Initialize with a default admin user for development
    this.createDefaultUser();
  }

  private async createDefaultUser() {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    this.users.push({
      id: '1',
      username: 'admin',
      email: 'admin@bytebot.ai',
      password: hashedPassword,
      roles: ['admin', 'user'],
    });
    this.logger.log('Default admin user created');
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    try {
      const user = this.users.find(
        (u) => u.username === username || u.email === username,
      );
      
      if (user && (await bcrypt.compare(password, user.password))) {
        // Remove password from returned user object
        const { password: _, ...result } = user;
        return result as User;
      }
      
      return null;
    } catch (error) {
      this.logger.error(`Error validating user: ${error.message}`);
      return null;
    }
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string } | null> {
    try {
      const user = await this.validateUser(loginDto.username, loginDto.password);
      
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      
      const payload = { 
        username: user.username, 
        sub: user.id,
        roles: user.roles,
      };
      
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      this.logger.error(`Login error: ${error.message}`);
      throw error;
    }
  }

  async register(registerDto: RegisterDto): Promise<{ access_token: string } | null> {
    try {
      // Check if user already exists
      const existingUser = this.users.find(
        (u) => u.username === registerDto.username || u.email === registerDto.email,
      );
      
      if (existingUser) {
        throw new UnauthorizedException('User already exists');
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);
      
      // Create new user
      const newUser: User = {
        id: (this.users.length + 1).toString(),
        username: registerDto.username,
        email: registerDto.email,
        password: hashedPassword,
        roles: registerDto.roles || ['user'],
      };
      
      this.users.push(newUser);
      
      // Generate JWT token
      const payload = { 
        username: newUser.username, 
        sub: newUser.id,
        roles: newUser.roles,
      };
      
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      this.logger.error(`Registration error: ${error.message}`);
      throw error;
    }
  }

  async validateToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      this.logger.error(`Token validation error: ${error.message}`);
      return null;
    }
  }

  async getUsers(): Promise<Omit<User, 'password'>[]> {
    return this.users.map(({ password, ...user }) => user);
  }

  async getUserById(id: string): Promise<Omit<User, 'password'> | undefined> {
    const user = this.users.find((u) => u.id === id);
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return undefined;
  }
}