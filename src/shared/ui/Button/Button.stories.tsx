import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  title: 'Shared/UI/Button',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    onClick: { action: 'clicked' },
  },
  args: {
    children: 'Button',
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// 基本的なストーリー
export const Primary: Story = {
  args: {
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
};

// サイズバリエーション
export const Small: Story = {
  args: {
    size: 'small',
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
  },
};

// 状態バリエーション
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
  },
  parameters: {
    layout: 'padded',
  },
};

// インタラクティブな例
export const ClickExample: Story = {
  args: {
    children: 'Click me!',
    onClick: () => alert('Button clicked!'),
  },
};

// アクセシビリティのデモ
export const WithKeyboardNavigation: Story = {
  name: 'Keyboard Navigation (Tab to focus)',
  args: {
    children: 'Tab to focus me',
  },
  parameters: {
    docs: {
      description: {
        story: 'This button demonstrates keyboard navigation. Press Tab to focus the button, then Enter or Space to activate it.',
      },
    },
  },
};