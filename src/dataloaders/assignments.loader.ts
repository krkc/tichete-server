import * as DataLoader from 'dataloader';
import { Injectable } from '@nestjs/common';
import { NestDataLoader } from '../interceptors/nest-data-loader.interceptor';
import { AssignmentsService } from '../domain/assignments/assignments.service';
import { Assignment } from '../domain/assignments/assignment.entity';

@Injectable()
export class AssignmentLoader implements NestDataLoader<string, Assignment[]> {
  private keyColumnName: string;
  constructor(private readonly assignmentsService: AssignmentsService) { }

  generateDataLoader({ keyColumnName }) {
    this.keyColumnName = keyColumnName;
    return new DataLoader<string, Assignment[]>(async (keys) => {
      const assignments = await this.assignmentsService.repo.createQueryBuilder()
        .where(`${this.keyColumnName} IN (:...keys)`, { keys })
        .getMany();
      const assignmentsMap = {};
      assignments.forEach(assignment => {
        const userId = assignment[this.keyColumnName];
        assignmentsMap[userId] = assignmentsMap[userId] || [];
        assignmentsMap[userId].push(assignment);
      });
      return keys.map(key => assignmentsMap[key]);
    });
  }
}
