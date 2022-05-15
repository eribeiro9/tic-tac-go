import { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * @returns NestJS application
 */
export async function bootstrapNestJS(): Promise<INestApplicationContext> {
  return NestFactory.createApplicationContext(AppModule);
}
