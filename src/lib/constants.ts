export const AI_TOOLS = [
  {
    id: 'cursor',
    name: 'Cursor',
    description: 'AI Code Editor',
    plans: [
      { id: 'hobby', name: 'Hobby (Free)', price: 0 },
      { id: 'pro', name: 'Pro', price: 20 },
      { id: 'business', name: 'Business', price: 40 },
      { id: 'enterprise', name: 'Enterprise', price: 0 }, // Custom
    ],
  },
  {
    id: 'copilot',
    name: 'GitHub Copilot',
    description: 'AI Pair Programmer',
    plans: [
      { id: 'individual', name: 'Individual', price: 10 },
      { id: 'business', name: 'Business', price: 19 },
      { id: 'enterprise', name: 'Enterprise', price: 39 },
    ],
  },
  {
    id: 'claude',
    name: 'Claude',
    description: 'Anthropic Assistant',
    plans: [
      { id: 'free', name: 'Free', price: 0 },
      { id: 'pro', name: 'Pro', price: 20 },
      { id: 'team', name: 'Team', price: 30 },
      { id: 'enterprise', name: 'Enterprise', price: 0 }, // Custom
    ],
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    description: 'OpenAI Assistant',
    plans: [
      { id: 'plus', name: 'Plus', price: 20 },
      { id: 'team', name: 'Team', price: 25 },
      { id: 'enterprise', name: 'Enterprise', price: 0 }, // Custom
    ],
  },
  {
    id: 'anthropic_api',
    name: 'Anthropic API',
    description: 'Direct API Access',
    plans: [{ id: 'payg', name: 'Pay as you go', price: 0 }],
  },
  {
    id: 'openai_api',
    name: 'OpenAI API',
    description: 'Direct API Access',
    plans: [{ id: 'payg', name: 'Pay as you go', price: 0 }],
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    description: 'Google AI',
    plans: [
      { id: 'pro', name: 'Pro', price: 0 },
      { id: 'advanced', name: 'Advanced', price: 20 },
      { id: 'api', name: 'API', price: 0 },
    ],
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    description: 'AI IDE by Codeium',
    plans: [
      { id: 'free', name: 'Free', price: 0 },
      { id: 'pro', name: 'Pro', price: 15 },
    ],
  },
];

export const USE_CASES = [
  { id: 'coding', label: 'Software Engineering / Coding' },
  { id: 'writing', label: 'Copywriting / Marketing' },
  { id: 'data', label: 'Data Analysis' },
  { id: 'research', label: 'Research & Strategy' },
  { id: 'mixed', label: 'Mixed / Cross-functional' },
];
