const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports.getCompletion = async function getCompletion(prompt, { tools, system, temperature = 0.5 }) {
  const completion = await openai.chat.completions.create({
    messages: [
      ...(system ? [{ role: 'system', content: system }] : []),
      { role: 'user', content: prompt },
    ],
    model: 'gpt-3.5-turbo', // Consider using 4o -- more expensive, but still quite cheap!
    tools,
    temperature,
    tool_choice: 'auto',
  });

  return completion.choices[0].message;
};
