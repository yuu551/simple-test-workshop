import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './checkbox';
import { useState } from 'react';

const meta = {
  title: 'Shared/UI/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Accept terms and conditions',
  },
};

export const Checked: Story = {
  args: {
    children: 'Checked checkbox',
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled checkbox',
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    children: 'Disabled checked checkbox',
    disabled: true,
    defaultChecked: true,
  },
};

export const Interactive: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <Checkbox checked={checked} onCheckedChange={(e) => setChecked(e.checked)}>
        {checked ? 'Checked' : 'Unchecked'} - Click me!
      </Checkbox>
    );
  },
};

export const Group: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <Checkbox defaultChecked>Subscribe to newsletter</Checkbox>
      <Checkbox>Receive promotional emails</Checkbox>
      <Checkbox disabled>Beta features (coming soon)</Checkbox>
      <Checkbox defaultChecked disabled>Essential notifications</Checkbox>
    </div>
  ),
};