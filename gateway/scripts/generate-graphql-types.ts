import { GraphQLDefinitionsFactory } from '@nestjs/graphql';
import { GraphQLGenerationOptions } from '../src/common/configs/graphql.config';

const definitionsFactory = new GraphQLDefinitionsFactory();

definitionsFactory.generate(GraphQLGenerationOptions);
