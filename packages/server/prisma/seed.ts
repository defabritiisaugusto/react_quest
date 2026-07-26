import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.userAchievement.deleteMany();
  await prisma.progress.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.challenge.deleteMany();
  await prisma.level.deleteMany();
  await prisma.world.deleteMany();

  // ── World 1: React Village ──
  const w1 = await prisma.world.create({
    data: {
      slug: 'react-village',
      titleKey: 'worlds.reactVillage.title',
      descKey: 'worlds.reactVillage.desc',
      order: 1,
      unlockXp: 0,
    },
  });

  const w1l1 = await prisma.level.create({
    data: { worldId: w1.id, titleKey: 'levels.jsxBasics.title', descKey: 'levels.jsxBasics.desc', order: 1, difficulty: 'BEGINNER' },
  });

  const w1l2 = await prisma.level.create({
    data: { worldId: w1.id, titleKey: 'levels.components.title', descKey: 'levels.components.desc', order: 2, difficulty: 'BEGINNER' },
  });

  const w1l3 = await prisma.level.create({
    data: { worldId: w1.id, titleKey: 'levels.propsAndRendering.title', descKey: 'levels.propsAndRendering.desc', order: 3, difficulty: 'EASY' },
  });

  // Challenge 1: Hello React
  await prisma.challenge.create({
    data: {
      levelId: w1l1.id,
      titleKey: 'challenges.helloReact.title',
      descriptionKey: 'challenges.helloReact.desc',
      order: 1,
      xpReward: 50,
      expectedConcept: 'jsx',
      initialCode: `// Write a component that renders "Hello, React!" inside an h1 tag
export default function App() {
  return (
    // Your code here
  )
}`,
      solutionCode: `export default function App() {
  return (
    <h1>Hello, React!</h1>
  )
}`,
      tests: [
        { type: 'ast', description: 'Must have a default export', check: 'hasExportDefault', args: {} },
        { type: 'ast', description: 'Must use an h1 element', check: 'hasJSXElement', args: { element: 'h1' } },
      ],
      hints: ['JSX looks like HTML but lives inside JavaScript', 'Wrap your element in parentheses after return'],
    },
  });

  // Challenge 2: Multiple Elements
  await prisma.challenge.create({
    data: {
      levelId: w1l1.id,
      titleKey: 'challenges.multipleElements.title',
      descriptionKey: 'challenges.multipleElements.desc',
      order: 2,
      xpReward: 75,
      expectedConcept: 'jsx-fragment',
      initialCode: `// Return an h1 with "Title" and a p with "Description"
// Hint: you need a wrapper or a Fragment
export default function App() {
  return (
    <h1>Title</h1>
    <p>Description</p>
  )
}`,
      solutionCode: `export default function App() {
  return (
    <>
      <h1>Title</h1>
      <p>Description</p>
    </>
  )
}`,
      tests: [
        { type: 'ast', description: 'Must have an h1 element', check: 'hasJSXElement', args: { element: 'h1' } },
        { type: 'ast', description: 'Must have a p element', check: 'hasJSXElement', args: { element: 'p' } },
      ],
      hints: ['JSX expressions must have one parent element', 'Use <> ... </> (Fragment) to group without adding a DOM element'],
    },
  });

  // Challenge 3: First Component
  await prisma.challenge.create({
    data: {
      levelId: w1l2.id,
      titleKey: 'challenges.firstComponent.title',
      descriptionKey: 'challenges.firstComponent.desc',
      order: 1,
      xpReward: 75,
      expectedConcept: 'components',
      initialCode: `// Create a Greeting component that renders "Welcome!"
// Then use it inside App

export default function App() {
  return (
    <div>
      {/* Use your Greeting component here */}
    </div>
  )
}`,
      solutionCode: `function Greeting() {
  return <h2>Welcome!</h2>
}

export default function App() {
  return (
    <div>
      <Greeting />
    </div>
  )
}`,
      tests: [
        { type: 'ast', description: 'Must define a Greeting component', check: 'hasFunctionComponent', args: { name: 'Greeting' } },
        { type: 'ast', description: 'Must use the Greeting component', check: 'hasJSXElement', args: { element: 'Greeting' } },
      ],
      hints: ['Components are functions that return JSX', 'Component names must start with a capital letter'],
    },
  });

  // Challenge 4: Props Introduction
  await prisma.challenge.create({
    data: {
      levelId: w1l2.id,
      titleKey: 'challenges.propsIntro.title',
      descriptionKey: 'challenges.propsIntro.desc',
      order: 2,
      xpReward: 100,
      expectedConcept: 'props',
      initialCode: `// Create a UserCard component that accepts "name" and "role" props
// and displays them

export default function App() {
  return (
    <div>
      <UserCard name="Alice" role="Developer" />
      <UserCard name="Bob" role="Designer" />
    </div>
  )
}`,
      solutionCode: `function UserCard({ name, role }) {
  return (
    <div>
      <h3>{name}</h3>
      <p>{role}</p>
    </div>
  )
}

export default function App() {
  return (
    <div>
      <UserCard name="Alice" role="Developer" />
      <UserCard name="Bob" role="Designer" />
    </div>
  )
}`,
      tests: [
        { type: 'ast', description: 'Must define UserCard component', check: 'hasFunctionComponent', args: { name: 'UserCard' } },
        { type: 'ast', description: 'Must pass name prop', check: 'hasProps', args: { prop: 'name' } },
        { type: 'ast', description: 'Must pass role prop', check: 'hasProps', args: { prop: 'role' } },
      ],
      hints: ['Props are passed like HTML attributes', 'Destructure props in the function parameters: { name, role }'],
    },
  });

  // Challenge 5: Dynamic Content
  await prisma.challenge.create({
    data: {
      levelId: w1l3.id,
      titleKey: 'challenges.dynamicContent.title',
      descriptionKey: 'challenges.dynamicContent.desc',
      order: 1,
      xpReward: 75,
      expectedConcept: 'expressions',
      initialCode: `// Use JavaScript expressions in JSX
// Display: "Today is [current day]" and "2 + 2 = [result]"
export default function App() {
  const day = new Date().toLocaleDateString();

  return (
    <div>
      {/* Use curly braces {} to embed expressions */}
    </div>
  )
}`,
      solutionCode: `export default function App() {
  const day = new Date().toLocaleDateString();

  return (
    <div>
      <p>Today is {day}</p>
      <p>2 + 2 = {2 + 2}</p>
    </div>
  )
}`,
      tests: [
        { type: 'ast', description: 'Must have a default export', check: 'hasExportDefault', args: {} },
        { type: 'ast', description: 'Must use p elements', check: 'hasJSXElement', args: { element: 'p' } },
      ],
      hints: ['Use {expression} inside JSX to embed JavaScript', 'Any valid JS expression works: variables, math, function calls'],
    },
  });

  // Challenge 6: Conditional Rendering
  await prisma.challenge.create({
    data: {
      levelId: w1l3.id,
      titleKey: 'challenges.conditionalRendering.title',
      descriptionKey: 'challenges.conditionalRendering.desc',
      order: 2,
      xpReward: 100,
      expectedConcept: 'conditional-rendering',
      initialCode: `// Show "Welcome back!" if isLoggedIn is true
// Show "Please log in" if false
export default function App() {
  const isLoggedIn = true;

  return (
    <div>
      {/* Add conditional rendering here */}
    </div>
  )
}`,
      solutionCode: `export default function App() {
  const isLoggedIn = true;

  return (
    <div>
      {isLoggedIn ? <h1>Welcome back!</h1> : <h1>Please log in</h1>}
    </div>
  )
}`,
      tests: [
        { type: 'ast', description: 'Must have a default export', check: 'hasExportDefault', args: {} },
        { type: 'ast', description: 'Must use h1 elements', check: 'hasJSXElement', args: { element: 'h1' } },
      ],
      hints: ['Use the ternary operator: condition ? <A /> : <B />', 'You can also use && for conditional rendering: condition && <Element />'],
    },
  });

  // Challenge 7: List Rendering
  await prisma.challenge.create({
    data: {
      levelId: w1l3.id,
      titleKey: 'challenges.listRendering.title',
      descriptionKey: 'challenges.listRendering.desc',
      order: 3,
      xpReward: 100,
      expectedConcept: 'lists',
      initialCode: `// Render the fruits array as a list
export default function App() {
  const fruits = ["Apple", "Banana", "Cherry", "Date"];

  return (
    <ul>
      {/* Map the fruits to li elements */}
    </ul>
  )
}`,
      solutionCode: `export default function App() {
  const fruits = ["Apple", "Banana", "Cherry", "Date"];

  return (
    <ul>
      {fruits.map((fruit) => (
        <li key={fruit}>{fruit}</li>
      ))}
    </ul>
  )
}`,
      tests: [
        { type: 'ast', description: 'Must use .map() to render list', check: 'hasArrayMap', args: {} },
        { type: 'ast', description: 'Must use li elements', check: 'hasJSXElement', args: { element: 'li' } },
        { type: 'ast', description: 'Must pass key prop', check: 'hasProps', args: { prop: 'key' } },
      ],
      hints: ['Use array.map() to transform data into JSX', 'Each list item needs a unique key prop'],
    },
  });

  // Challenge 8: Component Composition
  await prisma.challenge.create({
    data: {
      levelId: w1l3.id,
      titleKey: 'challenges.composition.title',
      descriptionKey: 'challenges.composition.desc',
      order: 4,
      xpReward: 100,
      expectedConcept: 'composition',
      initialCode: `// Create Header, Content, and Footer components
// Compose them together in App

export default function App() {
  return (
    <div>
      {/* Compose Header, Content, and Footer here */}
    </div>
  )
}`,
      solutionCode: `function Header() {
  return <header><h1>My App</h1></header>
}

function Content() {
  return <main><p>Welcome to my app</p></main>
}

function Footer() {
  return <footer><p>© 2024</p></footer>
}

export default function App() {
  return (
    <div>
      <Header />
      <Content />
      <Footer />
    </div>
  )
}`,
      tests: [
        { type: 'ast', description: 'Must have Header component', check: 'hasFunctionComponent', args: { name: 'Header' } },
        { type: 'ast', description: 'Must have Content component', check: 'hasFunctionComponent', args: { name: 'Content' } },
        { type: 'ast', description: 'Must have Footer component', check: 'hasFunctionComponent', args: { name: 'Footer' } },
        { type: 'ast', description: 'Must use Header in App', check: 'hasJSXElement', args: { element: 'Header' } },
      ],
      hints: ['Break your UI into small, focused components', 'Each component should do one thing well'],
    },
  });

  // ── World 2: State Forest ──
  const w2 = await prisma.world.create({
    data: {
      slug: 'state-forest',
      titleKey: 'worlds.stateForest.title',
      descKey: 'worlds.stateForest.desc',
      order: 2,
      unlockXp: 500,
    },
  });

  const w2l1 = await prisma.level.create({
    data: { worldId: w2.id, titleKey: 'levels.useState.title', descKey: 'levels.useState.desc', order: 1, difficulty: 'EASY' },
  });

  const w2l2 = await prisma.level.create({
    data: { worldId: w2.id, titleKey: 'levels.formsAndEvents.title', descKey: 'levels.formsAndEvents.desc', order: 2, difficulty: 'MEDIUM' },
  });

  // Challenge 9: Broken Counter
  await prisma.challenge.create({
    data: {
      levelId: w2l1.id,
      titleKey: 'challenges.brokenCounter.title',
      descriptionKey: 'challenges.brokenCounter.desc',
      order: 1,
      xpReward: 100,
      expectedConcept: 'useState',
      initialCode: `// The wizard's counter is broken. Fix it using useState!
import React from 'react';

export default function Counter() {
  let count = 0;

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => count++}>Increment</button>
    </div>
  )
}`,
      solutionCode: `import React, { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}`,
      tests: [
        { type: 'ast', description: 'Must import useState', check: 'hasImport', args: { source: 'react', specifier: 'useState' } },
        { type: 'ast', description: 'Must call useState', check: 'hasCallExpression', args: { callee: 'useState' } },
        { type: 'ast', description: 'Must not directly mutate count', check: 'noDirectMutation', args: { variable: 'count' } },
      ],
      hints: ['Regular variables don\'t trigger re-renders', 'Import useState from React and use: const [count, setCount] = useState(0)', 'Use setCount to update the value'],
    },
  });

  // Challenge 10: Toggle Switch
  await prisma.challenge.create({
    data: {
      levelId: w2l1.id,
      titleKey: 'challenges.toggleSwitch.title',
      descriptionKey: 'challenges.toggleSwitch.desc',
      order: 2,
      xpReward: 100,
      expectedConcept: 'useState-boolean',
      initialCode: `// Create a toggle that switches between ON and OFF
import React from 'react';

export default function Toggle() {
  // Add state here

  return (
    <div>
      <p>{/* Show ON or OFF */}</p>
      <button>{/* Toggle button */}</button>
    </div>
  )
}`,
      solutionCode: `import React, { useState } from 'react';

export default function Toggle() {
  const [isOn, setIsOn] = useState(false);

  return (
    <div>
      <p>{isOn ? 'ON' : 'OFF'}</p>
      <button onClick={() => setIsOn(!isOn)}>Toggle</button>
    </div>
  )
}`,
      tests: [
        { type: 'ast', description: 'Must import useState', check: 'hasImport', args: { source: 'react', specifier: 'useState' } },
        { type: 'ast', description: 'Must call useState', check: 'hasCallExpression', args: { callee: 'useState' } },
        { type: 'ast', description: 'Must have a button', check: 'hasJSXElement', args: { element: 'button' } },
      ],
      hints: ['Use a boolean state: useState(false)', 'Toggle with: setIsOn(!isOn) or setIsOn(prev => !prev)'],
    },
  });

  // Challenge 11: Controlled Input
  await prisma.challenge.create({
    data: {
      levelId: w2l1.id,
      titleKey: 'challenges.controlledInput.title',
      descriptionKey: 'challenges.controlledInput.desc',
      order: 3,
      xpReward: 100,
      expectedConcept: 'controlled-input',
      initialCode: `// Create a controlled input that shows what you type in real-time
import React from 'react';

export default function LiveInput() {
  return (
    <div>
      <input type="text" />
      <p>You typed: </p>
    </div>
  )
}`,
      solutionCode: `import React, { useState } from 'react';

export default function LiveInput() {
  const [text, setText] = useState('');

  return (
    <div>
      <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
      <p>You typed: {text}</p>
    </div>
  )
}`,
      tests: [
        { type: 'ast', description: 'Must use useState', check: 'hasCallExpression', args: { callee: 'useState' } },
        { type: 'ast', description: 'Must have an input element', check: 'hasJSXElement', args: { element: 'input' } },
        { type: 'ast', description: 'Must use value prop on input', check: 'hasProps', args: { prop: 'value' } },
        { type: 'ast', description: 'Must use onChange prop', check: 'hasProps', args: { prop: 'onChange' } },
      ],
      hints: ['A controlled input has value and onChange props', 'Use e.target.value to get the input value'],
    },
  });

  // Challenge 12: Form Handling
  await prisma.challenge.create({
    data: {
      levelId: w2l2.id,
      titleKey: 'challenges.formHandling.title',
      descriptionKey: 'challenges.formHandling.desc',
      order: 1,
      xpReward: 125,
      expectedConcept: 'forms',
      initialCode: `// Create a form with name and email fields
// On submit, display the submitted data
import React from 'react';

export default function SignupForm() {
  return (
    <form>
      {/* Add controlled inputs for name and email */}
      {/* Add a submit button */}
    </form>
  )
}`,
      solutionCode: `import React, { useState } from 'react';

export default function SignupForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" />
      <button type="submit">Submit</button>
      {submitted && <p>Hello {name} ({email})!</p>}
    </form>
  )
}`,
      tests: [
        { type: 'ast', description: 'Must use useState', check: 'hasCallExpression', args: { callee: 'useState' } },
        { type: 'ast', description: 'Must have a form element', check: 'hasJSXElement', args: { element: 'form' } },
        { type: 'ast', description: 'Must handle onSubmit', check: 'hasProps', args: { prop: 'onSubmit' } },
        { type: 'ast', description: 'Must have input elements', check: 'hasJSXElement', args: { element: 'input' } },
      ],
      hints: ['Use onSubmit on the form element', 'Call e.preventDefault() to stop page reload', 'Each input needs its own state'],
    },
  });

  // Challenge 13: Lifting State Up
  await prisma.challenge.create({
    data: {
      levelId: w2l2.id,
      titleKey: 'challenges.liftingState.title',
      descriptionKey: 'challenges.liftingState.desc',
      order: 2,
      xpReward: 150,
      expectedConcept: 'lifting-state',
      initialCode: `// Two TemperatureInput components should stay in sync
// When you change Celsius, Fahrenheit updates and vice versa
import React from 'react';

function TemperatureInput({ scale, temperature, onTemperatureChange }) {
  return (
    <div>
      <label>{scale === 'c' ? 'Celsius' : 'Fahrenheit'}</label>
      <input value={temperature} onChange={(e) => onTemperatureChange(e.target.value)} />
    </div>
  );
}

export default function Calculator() {
  // Lift the state up here!
  return (
    <div>
      <TemperatureInput scale="c" />
      <TemperatureInput scale="f" />
    </div>
  )
}`,
      solutionCode: `import React, { useState } from 'react';

function TemperatureInput({ scale, temperature, onTemperatureChange }) {
  return (
    <div>
      <label>{scale === 'c' ? 'Celsius' : 'Fahrenheit'}</label>
      <input value={temperature} onChange={(e) => onTemperatureChange(e.target.value)} />
    </div>
  );
}

export default function Calculator() {
  const [temperature, setTemperature] = useState('');
  const [scale, setScale] = useState('c');

  const celsius = scale === 'f' ? ((parseFloat(temperature) - 32) * 5 / 9).toFixed(1) : temperature;
  const fahrenheit = scale === 'c' ? ((parseFloat(temperature) * 9 / 5) + 32).toFixed(1) : temperature;

  return (
    <div>
      <TemperatureInput scale="c" temperature={celsius} onTemperatureChange={(t) => { setScale('c'); setTemperature(t); }} />
      <TemperatureInput scale="f" temperature={fahrenheit} onTemperatureChange={(t) => { setScale('f'); setTemperature(t); }} />
    </div>
  )
}`,
      tests: [
        { type: 'ast', description: 'Must use useState in Calculator', check: 'hasCallExpression', args: { callee: 'useState' } },
        { type: 'ast', description: 'Must pass temperature prop', check: 'hasProps', args: { prop: 'temperature' } },
        { type: 'ast', description: 'Must pass onTemperatureChange prop', check: 'hasProps', args: { prop: 'onTemperatureChange' } },
      ],
      hints: ['The shared state should live in the closest common ancestor', 'Pass the state and setter down as props', 'Convert temperatures based on which input changed last'],
    },
  });

  // Challenge 14: State from Props
  await prisma.challenge.create({
    data: {
      levelId: w2l2.id,
      titleKey: 'challenges.stateFromProps.title',
      descriptionKey: 'challenges.stateFromProps.desc',
      order: 3,
      xpReward: 125,
      expectedConcept: 'state-initialization',
      initialCode: `// Create an EditableText that starts with the initial text from props
// but can be edited independently
import React from 'react';

function EditableText({ initialText }) {
  // Initialize state from the prop
  return (
    <input />
  )
}

export default function App() {
  return (
    <div>
      <EditableText initialText="Click to edit me" />
      <EditableText initialText="I'm independent!" />
    </div>
  )
}`,
      solutionCode: `import React, { useState } from 'react';

function EditableText({ initialText }) {
  const [text, setText] = useState(initialText);

  return (
    <input value={text} onChange={(e) => setText(e.target.value)} />
  )
}

export default function App() {
  return (
    <div>
      <EditableText initialText="Click to edit me" />
      <EditableText initialText="I'm independent!" />
    </div>
  )
}`,
      tests: [
        { type: 'ast', description: 'Must use useState', check: 'hasCallExpression', args: { callee: 'useState' } },
        { type: 'ast', description: 'Must define EditableText', check: 'hasFunctionComponent', args: { name: 'EditableText' } },
        { type: 'ast', description: 'Must pass initialText prop', check: 'hasProps', args: { prop: 'initialText' } },
      ],
      hints: ['useState(initialValue) only sets the state on first render', 'The prop serves as the initial value, not a live binding'],
    },
  });

  // ── World 3: Hook Dungeon ──
  const w3 = await prisma.world.create({
    data: {
      slug: 'hook-dungeon',
      titleKey: 'worlds.hookDungeon.title',
      descKey: 'worlds.hookDungeon.desc',
      order: 3,
      unlockXp: 1200,
    },
  });

  const w3l1 = await prisma.level.create({
    data: { worldId: w3.id, titleKey: 'levels.useEffect.title', descKey: 'levels.useEffect.desc', order: 1, difficulty: 'MEDIUM' },
  });

  const w3l2 = await prisma.level.create({
    data: { worldId: w3.id, titleKey: 'levels.advancedHooks.title', descKey: 'levels.advancedHooks.desc', order: 2, difficulty: 'HARD' },
  });

  // Challenge 15: Data Fetcher
  await prisma.challenge.create({
    data: {
      levelId: w3l1.id,
      titleKey: 'challenges.dataFetcher.title',
      descriptionKey: 'challenges.dataFetcher.desc',
      order: 1,
      xpReward: 150,
      expectedConcept: 'useEffect',
      initialCode: `// Fetch a user from the API when the component mounts
import React from 'react';

export default function UserProfile() {
  // Fetch from: https://jsonplaceholder.typicode.com/users/1

  return (
    <div>
      <h2>Loading...</h2>
    </div>
  )
}`,
      solutionCode: `import React, { useState, useEffect } from 'react';

export default function UserProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users/1')
      .then(res => res.json())
      .then(data => setUser(data));
  }, []);

  if (!user) return <div><h2>Loading...</h2></div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  )
}`,
      tests: [
        { type: 'ast', description: 'Must import useEffect', check: 'hasImport', args: { source: 'react', specifier: 'useEffect' } },
        { type: 'ast', description: 'Must call useEffect', check: 'hasCallExpression', args: { callee: 'useEffect' } },
        { type: 'ast', description: 'Must use useState for data', check: 'hasCallExpression', args: { callee: 'useState' } },
      ],
      hints: ['useEffect runs side effects after render', 'Pass an empty dependency array [] to run only on mount', 'Store fetched data in state with useState'],
    },
  });

  // Challenge 16: Cleanup Effect
  await prisma.challenge.create({
    data: {
      levelId: w3l1.id,
      titleKey: 'challenges.cleanupEffect.title',
      descriptionKey: 'challenges.cleanupEffect.desc',
      order: 2,
      xpReward: 150,
      expectedConcept: 'useEffect-cleanup',
      initialCode: `// Create a clock that updates every second
// Make sure to clean up the interval when the component unmounts!
import React from 'react';

export default function Clock() {
  return (
    <div>
      <h2>Current time: ???</h2>
    </div>
  )
}`,
      solutionCode: `import React, { useState, useEffect } from 'react';

export default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Current time: {time.toLocaleTimeString()}</h2>
    </div>
  )
}`,
      tests: [
        { type: 'ast', description: 'Must use useEffect', check: 'hasCallExpression', args: { callee: 'useEffect' } },
        { type: 'ast', description: 'Must use useState', check: 'hasCallExpression', args: { callee: 'useState' } },
        { type: 'ast', description: 'Must call setInterval', check: 'hasCallExpression', args: { callee: 'setInterval' } },
        { type: 'ast', description: 'Must call clearInterval for cleanup', check: 'hasCallExpression', args: { callee: 'clearInterval' } },
      ],
      hints: ['Return a cleanup function from useEffect', 'Use setInterval for repeated updates', 'Clean up with clearInterval to prevent memory leaks'],
    },
  });

  // Challenge 17: DOM Reference
  await prisma.challenge.create({
    data: {
      levelId: w3l2.id,
      titleKey: 'challenges.domReference.title',
      descriptionKey: 'challenges.domReference.desc',
      order: 1,
      xpReward: 150,
      expectedConcept: 'useRef',
      initialCode: `// Create an input that auto-focuses when the component mounts
// Add a button that focuses the input when clicked
import React from 'react';

export default function AutoFocusInput() {
  return (
    <div>
      <input placeholder="I should auto-focus" />
      <button>Focus Input</button>
    </div>
  )
}`,
      solutionCode: `import React, { useRef, useEffect } from 'react';

export default function AutoFocusInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div>
      <input ref={inputRef} placeholder="I should auto-focus" />
      <button onClick={() => inputRef.current?.focus()}>Focus Input</button>
    </div>
  )
}`,
      tests: [
        { type: 'ast', description: 'Must import useRef', check: 'hasImport', args: { source: 'react', specifier: 'useRef' } },
        { type: 'ast', description: 'Must call useRef', check: 'hasCallExpression', args: { callee: 'useRef' } },
        { type: 'ast', description: 'Must use ref prop', check: 'hasProps', args: { prop: 'ref' } },
      ],
      hints: ['useRef creates a mutable ref object', 'Attach it to a DOM element with the ref prop', 'Access the element with ref.current'],
    },
  });

  // Challenge 18: Custom Hook
  await prisma.challenge.create({
    data: {
      levelId: w3l2.id,
      titleKey: 'challenges.customHook.title',
      descriptionKey: 'challenges.customHook.desc',
      order: 2,
      xpReward: 175,
      expectedConcept: 'custom-hooks',
      initialCode: `// Create a custom hook called useToggle
// It should return [value, toggle] where toggle flips the boolean
import React from 'react';

// Create your useToggle hook here

export default function App() {
  // Use your hook: const [isOpen, toggleOpen] = useToggle(false)

  return (
    <div>
      <p>Menu is: {/* show open/closed */}</p>
      <button>{/* toggle button */}</button>
    </div>
  )
}`,
      solutionCode: `import React, { useState, useCallback } from 'react';

function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue(v => !v), []);
  return [value, toggle];
}

export default function App() {
  const [isOpen, toggleOpen] = useToggle(false);

  return (
    <div>
      <p>Menu is: {isOpen ? 'Open' : 'Closed'}</p>
      <button onClick={toggleOpen}>Toggle</button>
    </div>
  )
}`,
      tests: [
        { type: 'ast', description: 'Must define useToggle function', check: 'hasFunctionComponent', args: { name: 'useToggle' } },
        { type: 'ast', description: 'Must use useState inside hook', check: 'hasCallExpression', args: { callee: 'useState' } },
        { type: 'ast', description: 'Must have a button element', check: 'hasJSXElement', args: { element: 'button' } },
      ],
      hints: ['Custom hooks are just functions that start with "use"', 'They can use other hooks like useState', 'Return the values your component needs: [state, updater]'],
    },
  });

  // ── World 4: Component Kingdom ──
  const w4 = await prisma.world.create({
    data: {
      slug: 'component-kingdom',
      titleKey: 'worlds.componentKingdom.title',
      descKey: 'worlds.componentKingdom.desc',
      order: 4,
      unlockXp: 2000,
    },
  });

  const w4l1 = await prisma.level.create({
    data: { worldId: w4.id, titleKey: 'levels.patterns.title', descKey: 'levels.patterns.desc', order: 1, difficulty: 'HARD' },
  });

  // Challenge 19: Slot Pattern (children)
  await prisma.challenge.create({
    data: {
      levelId: w4l1.id,
      titleKey: 'challenges.slotPattern.title',
      descriptionKey: 'challenges.slotPattern.desc',
      order: 1,
      xpReward: 175,
      expectedConcept: 'children',
      initialCode: `// Create a Card component that accepts children
// It should wrap content in a styled container
import React from 'react';

// Create your Card component here

export default function App() {
  return (
    <div>
      {/* Use Card to wrap different content */}
    </div>
  )
}`,
      solutionCode: `import React from 'react';

function Card({ children, title }) {
  return (
    <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, margin: 8 }}>
      {title && <h3>{title}</h3>}
      {children}
    </div>
  )
}

export default function App() {
  return (
    <div>
      <Card title="Welcome">
        <p>This is inside the card!</p>
      </Card>
      <Card title="Another Card">
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      </Card>
    </div>
  )
}`,
      tests: [
        { type: 'ast', description: 'Must define Card component', check: 'hasFunctionComponent', args: { name: 'Card' } },
        { type: 'ast', description: 'Must use Card component', check: 'hasJSXElement', args: { element: 'Card' } },
        { type: 'ast', description: 'Must pass title prop', check: 'hasProps', args: { prop: 'title' } },
      ],
      hints: ['The children prop contains whatever is between <Card>...</Card>', 'Destructure it: function Card({ children, title })', 'Render children where you want the content to appear'],
    },
  });

  // Challenge 20: Render Props
  await prisma.challenge.create({
    data: {
      levelId: w4l1.id,
      titleKey: 'challenges.renderProps.title',
      descriptionKey: 'challenges.renderProps.desc',
      order: 2,
      xpReward: 200,
      expectedConcept: 'render-props',
      initialCode: `// Create a MouseTracker component that tracks mouse position
// Use render props pattern to share the mouse data
import React from 'react';

// Create MouseTracker that takes a "render" prop

export default function App() {
  return (
    <div style={{ height: '300px', border: '1px solid #ccc' }}>
      {/* Use MouseTracker with render prop */}
    </div>
  )
}`,
      solutionCode: `import React, { useState } from 'react';

function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div onMouseMove={handleMouseMove} style={{ height: '100%' }}>
      {render(position)}
    </div>
  );
}

export default function App() {
  return (
    <div style={{ height: '300px', border: '1px solid #ccc' }}>
      <MouseTracker render={({ x, y }) => (
        <p>Mouse position: {x}, {y}</p>
      )} />
    </div>
  )
}`,
      tests: [
        { type: 'ast', description: 'Must define MouseTracker', check: 'hasFunctionComponent', args: { name: 'MouseTracker' } },
        { type: 'ast', description: 'Must use useState for position', check: 'hasCallExpression', args: { callee: 'useState' } },
        { type: 'ast', description: 'Must use MouseTracker', check: 'hasJSXElement', args: { element: 'MouseTracker' } },
        { type: 'ast', description: 'Must pass render prop', check: 'hasProps', args: { prop: 'render' } },
      ],
      hints: ['A render prop is a function prop that returns JSX', 'The component calls props.render(data) to let the parent decide what to render', 'Track mouse with onMouseMove event'],
    },
  });

  // ── Achievements ──
  await prisma.achievement.createMany({
    data: [
      { slug: 'first-steps', nameKey: 'achievements.firstSteps.name', descKey: 'achievements.firstSteps.desc', icon: '👶', condition: { type: 'challenges_completed', value: 1 } },
      { slug: 'getting-started', nameKey: 'achievements.gettingStarted.name', descKey: 'achievements.gettingStarted.desc', icon: '🚀', condition: { type: 'challenges_completed', value: 5 } },
      { slug: 'hook-master', nameKey: 'achievements.hookMaster.name', descKey: 'achievements.hookMaster.desc', icon: '🪝', condition: { type: 'challenges_completed', value: 10 } },
      { slug: 'react-warrior', nameKey: 'achievements.reactWarrior.name', descKey: 'achievements.reactWarrior.desc', icon: '⚔️', condition: { type: 'challenges_completed', value: 20 } },
      { slug: 'level-5', nameKey: 'achievements.level5.name', descKey: 'achievements.level5.desc', icon: '⭐', condition: { type: 'level_reached', value: 5 } },
      { slug: 'perfect-score', nameKey: 'achievements.perfectScore.name', descKey: 'achievements.perfectScore.desc', icon: '💯', condition: { type: 'perfect_challenges', value: 3 } },
    ],
  });

  console.log('Seed completed: 4 worlds, 20 challenges, 6 achievements');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
