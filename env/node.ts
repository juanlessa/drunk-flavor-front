import { z } from 'zod/v4';

export const nodeEnvOptions = ['development', 'production', 'test'] as const;

export type NodeEnv = (typeof nodeEnvOptions)[number];

export const DEFAULT_NODE_ENV: NodeEnv = 'development';

export const nodeSchema = z.object({
	NODE_ENV: z.enum(nodeEnvOptions).default(DEFAULT_NODE_ENV)
});

export type NodeSchema = z.infer<typeof nodeSchema>;

export const parseNodeEnv = (source: NodeJS.ProcessEnv = process.env): NodeSchema =>
	nodeSchema.parse(source);
