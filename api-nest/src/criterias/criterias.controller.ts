import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { CriteriasService } from './criterias.service';
import { CreateCriteriaDto } from './dto/create-criteria.dto';
import { UpdateCriteriaDto } from './dto/update-criteria.dto';

@Controller('api/items')
export class CriteriasController {
  constructor(private readonly criteriasService: CriteriasService) {}

  @Post()
  create(@Body() createCriteriaDto: CreateCriteriaDto) {
    return this.criteriasService.create(createCriteriaDto);
  }

  @Get()
  findAll() {
    return this.criteriasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.criteriasService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCriteriaDto: UpdateCriteriaDto,
  ) {
    return this.criteriasService.update(id, updateCriteriaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.criteriasService.remove(id);
  }
}
