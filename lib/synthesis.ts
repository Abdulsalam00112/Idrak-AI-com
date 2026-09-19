import { generateText } from 'ai'
import { gateway } from '@ai-sdk/gateway'

export type SynthesisInput = { question: string; context: string[]; model?: string }

export async function synthesizeKnowledge(input: SynthesisInput) {
  const model = input.model || 'openai/gpt-4o-mini'
  const result = await generateText({ model: gateway(model), system: 'You are Idrak AI, an educational synthesis engine. Explain clearly, compare claims, identify agreement and contradiction, remove redundancy, and state uncertainty. Use only supplied context for factual claims.', prompt: `Question: ${input.question}\n\nVerified context:\n${input.context.map((item, index) => `[${index + 1}] ${item}`).join('\n')}` })
  return { answer: result.text, model, usage: result.usage }
}
