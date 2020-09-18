import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateRoleDto } from './dto/create-role.dto';
import { RolesService } from './roles.service';

@ApiBearerAuth()
@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  async getAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a role by id' })
  async getOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a role' })
  async create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a role' })
  async update(@Param('id') id: string, @Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.update(id, createRoleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a role' })
  async remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }
}
