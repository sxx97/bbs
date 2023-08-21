import {
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CategoryDto } from './category.dto';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post('add')
  @UseGuards(JwtAuthGuard)
  addCategory(@Body() data: CategoryDto) {
    return this.categoryService.addCategory(data.name);
  }

  @Post('update/:id')
  @UseGuards(JwtAuthGuard)
  updateCategory(@Param('id') id: string, @Body() data: CategoryDto) {
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      throw new Error(`Invalid ID: ${id}`);
    }
    return this.categoryService.updateCategory(numericId, data.name);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard)
  deleteCategory(@Param('id') id: string) {
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      throw new Error(`Invalid ID: ${id}`);
    }
    return this.categoryService.deleteCategory(numericId);
  }
}
