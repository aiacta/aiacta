import { graphql } from 'msw';

const api = graphql.link('/graphql');

export const handlers = [
  api.operation((req, res, ctx) => {
    console.log(req);
    return res(ctx.errors([{ message: 'Not authenticated' }]));
  }),
];
