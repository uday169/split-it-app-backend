/**
 * Lightweight OpenAPI 3.0 type definitions for Swagger doc objects.
 * Avoids pulling in the full openapi-types package as a dependency.
 */

/* eslint-disable @typescript-eslint/no-namespace */
export namespace OpenAPIV3 {
  export interface SchemaObject {
    type?: string;
    format?: string;
    properties?: Record<string, SchemaObject | ReferenceObject>;
    required?: string[];
    items?: SchemaObject | ReferenceObject;
    enum?: string[];
    example?: unknown;
    description?: string;
    default?: unknown;
    minimum?: number;
    maximum?: number;
    exclusiveMinimum?: boolean;
    minLength?: number;
    maxLength?: number;
    minItems?: number;
    [key: string]: unknown;
  }

  export interface ReferenceObject {
    $ref: string;
  }

  export interface MediaTypeObject {
    schema?: SchemaObject | ReferenceObject;
    example?: unknown;
  }

  export interface ResponseObject {
    description: string;
    content?: Record<string, MediaTypeObject>;
  }

  export interface ParameterObject {
    name: string;
    in: 'query' | 'path' | 'header' | 'cookie';
    required?: boolean;
    schema?: SchemaObject | ReferenceObject;
    description?: string;
  }

  export interface RequestBodyObject {
    required?: boolean;
    content: Record<string, MediaTypeObject>;
    description?: string;
  }

  export interface OperationObject {
    summary?: string;
    description?: string;
    tags?: string[];
    security?: Record<string, string[]>[];
    parameters?: ParameterObject[];
    requestBody?: RequestBodyObject;
    responses: Record<string, ResponseObject | ReferenceObject>;
  }

  export interface PathItemObject {
    get?: OperationObject;
    post?: OperationObject;
    put?: OperationObject;
    delete?: OperationObject;
    patch?: OperationObject;
  }

  export interface SecuritySchemeObject {
    type: string;
    scheme?: string;
    bearerFormat?: string;
    description?: string;
    [key: string]: unknown;
  }

  export type PathsObject = Record<string, PathItemObject>;
}
