const { makeExecutableSchema } = require("@graphql-tools/schema");
const { mergeSchemas } = require("@graphql-tools/merge");
const { FilterRootFields, RenameTypes } = require("@graphql-tools/wrap");
const { stitchSchemas } = require("@graphql-tools/stitch");

const RecommendationSchema = makeExecutableSchema({
  typeDefs: `
    type Product {
      productName: String
    }

    type Recommendation {
      base: [Product]
      recommended: [Product]
    }
    
    type RecommendationResponse {
      recommendations: [Recommendation]
    }
    
    type RecommendationAPI {
      variantId: String
      response: RecommendationResponse
    }
  `,
});

const SearchSchema = makeExecutableSchema({
  typeDefs: `
    type OnlyProduct {
      recommendations: Recommendation
    }

    type Product {
      recommendations: Recommendation
    }

    type Recommendation {
      buy: [Product]
      view: [Product]
      similars: [Product]
    }
  `,
});

const RecommendationSubschema = {
  schema: RecommendationSchema,
  transforms: [
    new RenameTypes((name) => `VTEX_RecommendationResolver_${name}`),
  ],
};

const SearchSubschema = {
  schema: SearchSchema,
  transforms: [new RenameTypes((name) => `VTEX_SearchResolver_${name}`)],
};

const gatewaySchema = stitchSchemas({
  subschemas: [RecommendationSubschema, SearchSubschema],
});

console.log(gatewaySchema.getTypeMap());