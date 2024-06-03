import { ForbiddenException, Injectable } from '@nestjs/common';
import { Product } from '@prisma/client';
import { CategoryService } from 'src/category/category.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    private prismaService: PrismaService,
    private categoryService: CategoryService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const category = await this.categoryService.findOne(
        createProductDto.categoryId,
      );

      const product = await this.prismaService.product.create({
        data: createProductDto,
      });
      return product;
    } catch (e) {
      if (e) {
        throw new ForbiddenException(e.message);
      }
      throw new ForbiddenException('товар не создан');
    }
  }

  async findAll(): Promise<Product[]> {
    try {
      const products = await this.prismaService.product.findMany();

      if (!products.length) {
        return [];
      }
      return products;
    } catch (e) {
      throw new ForbiddenException(
        'при получении товаров произошла ошибка',
      );
    }
  }

  async findOne(id: number): Promise<Product | null> {
    try {
      const product = await this.prismaService.product.findUnique({
        where: {
          id,
        },
      });

      if (!product) {
        return null;
      }
      return product;
    } catch (e) {
      throw new ForbiddenException(
        'при получении товара произошла ошибка',
      );
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.prismaService.product.update({
        where: {
          id,
        },
        data: updateProductDto,
      });

      if (!product) {
        return null;
      }
      return product;
    } catch (e) {
      throw new ForbiddenException(
        'при обновлении товара произошла ошибка',
      );
    }
  }

  async remove(id: number): Promise<string> {
    try {
      const deletedProduct = await this.prismaService.product.delete({
        where: { id },
      });

      return `Продукт ${id} успешно удален`;
    } catch (e) {
      throw new ForbiddenException(
        'при удалении товара произошла ошибка',
      );
    }
  }
}
