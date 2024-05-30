import { ForbiddenException, Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prismaService: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = await this.prismaService.category.create({
        data: {
          name: createCategoryDto.name,
        },
        select: {
          name: true,
        },
      });
      return category;
    } catch (e) {
      throw new ForbiddenException('категория не создана');
    }
  }

  async findAll() {
    try {
      const allCategories =
        await this.prismaService.category.findMany();
      return allCategories;
    } catch (e) {
      throw new ForbiddenException('Категории не получены');
    }
  }

  async findOne(id: number): Promise<Category | null> {
    try {
      const category = await this.prismaService.category.findUnique({
        where: {
          id,
        },
      });

      if (!category) {
        throw new ForbiddenException('Категория не найдена');
      }
      return category;
    } catch (e) {
      throw new ForbiddenException(
        'При поиске категории произошла ошибка',
      );
    }
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category | null> {
    try {
      const updateCategory = await this.prismaService.category.update(
        {
          where: {
            id,
          },
          data: {
            name: updateCategoryDto.name,
          },
        },
      );
      return updateCategory;
    } catch (e) {
      throw new ForbiddenException(
        'При обновлении категории произошла ошибка',
      );
    }
  }

  async remove(id: number): Promise<Category | null> {
    try {
      const deleteCategory = await this.prismaService.category.delete(
        {
          where: { id },
        },
      );
      if (!deleteCategory) {
        throw new ForbiddenException(
          'При удалении категории произошла ошибка',
        );
      }
      return deleteCategory;
    } catch (e) {
      throw new ForbiddenException(
        'При удалении категории произошла ошибка',
      );
    }
  }
}
