import { Controller } from '@nestjs/common';
import { QuizzService } from './quizz.service';

@Controller('quizz')
export class QuizzController {
  constructor(private readonly quizzService: QuizzService) {}
}
