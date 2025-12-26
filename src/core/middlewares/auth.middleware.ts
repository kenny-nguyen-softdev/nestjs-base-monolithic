import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { ExpressRequest } from '../types/express-request.interface';
import { JwtService } from '../services/jwt.service';
import { StaffService } from 'src/staff/staff.service';
import { SuccessResponse } from '../responses/base.responses';
import { Staff } from '../../staff/entities/staff.entity';
import { omit } from '../utils';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  /**
   *
   * @param staffService
   * @param jwtService
   */
  constructor(
    private readonly staffService: StaffService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Middleware to authenticate a staff based on a JWT token.
   *
   * This method checks for the presence of an authorization header in the request.
   * If an authorization header is not present, it sets the staff to null and
   * calls the next middleware.
   *
   * If an authorization header is present, it extracts the token, decodes it to
   * retrieve the staff ID, and fetches the staff details from the database. The
   * staff data is then added to the request object.
   *
   * In case of any error during token decoding or staff retrieval, the staff is
   * set to null and the next middleware is called.
   *
   * @param req - The incoming Express request object.
   * @param _ - The Express response object (not used).
   * @param next - The callback to pass control to the next middleware.
   */
  async use(req: ExpressRequest, _: Response, next: NextFunction) {
    // Check if the request has an authorization header
    if (!req.headers.authorization) {
      req.staff = null;
      // If the request does not have an authorization header, then the staff is not logged in
      next();
      return;
    }

    // Extract the token from the authorization header
    const token = req.headers.authorization.split(' ')[1];

    try {
      // Decode the JWT token
      const decode = this.jwtService.decodeJwtToken(token) as JwtPayload;

      // Find the staff by the id in the decoded token
      const res = await this.staffService.findOne(decode.id as string, {
        include: ['baseUser'],
      });

      // Add the staff to the request
      const staff = (res as SuccessResponse)?.data as Staff;

      req.staff = omit(staff, 'password');

      // Call the next middleware
      next();
    } catch (err) {
      // If there is any error, then the staff is not logged in
      console.error('Error decoding JWT token:', err);
      req.staff = null;
      next();
    }
  }
}
