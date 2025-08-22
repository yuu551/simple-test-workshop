import type { Meta, StoryObj } from '@storybook/react';
import { Field } from './field';
import { Input, Textarea } from '@chakra-ui/react';

const meta = {
  title: 'Shared/UI/Field',
  component: Field,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Email',
    helperText: 'Enter your email address',
    children: <Input placeholder="john@example.com" />,
  },
};

export const Required: Story = {
  args: {
    label: 'Name',
    required: true,
    children: <Input placeholder="Enter your name" />,
  },
};

export const WithError: Story = {
  args: {
    label: 'Password',
    required: true,
    invalid: true,
    errorText: 'Password must be at least 8 characters',
    children: <Input type="password" placeholder="Enter password" />,
  },
};

export const Optional: Story = {
  args: {
    label: 'Phone',
    optionalText: '(optional)',
    helperText: 'Include country code if international',
    children: <Input placeholder="+1-555-123-4567" />,
  },
};

export const TextArea: Story = {
  args: {
    label: 'Message',
    required: true,
    helperText: 'Tell us more about your inquiry',
    children: <Textarea placeholder="Type your message here..." rows={4} />,
  },
};

export const FormExample: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '400px' }}>
      <Field label="Name" required>
        <Input placeholder="Enter your name" />
      </Field>
      <Field label="Email" required errorText="Please enter a valid email">
        <Input placeholder="john@example.com" />
      </Field>
      <Field label="Phone" optionalText="(optional)" helperText="Include country code">
        <Input placeholder="+1-555-123-4567" />
      </Field>
      <Field label="Message" required>
        <Textarea placeholder="Your message..." rows={3} />
      </Field>
    </div>
  ),
};