import type { Meta, StoryObj } from '@storybook/react';
import { Header } from './Header';

const meta = {
  title: 'Shared/UI/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    colorPalette: {
      control: 'select',
      options: ['blue', 'green', 'red', 'purple', 'gray'],
    },
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Feature-Sliced Design Demo',
    subtitle: 'Modern Frontend Architecture with Storybook & Vitest',
  },
};

export const WithoutSubtitle: Story = {
  args: {
    title: 'Simple Header',
  },
};

export const GreenTheme: Story = {
  args: {
    title: 'Success Page',
    subtitle: 'Your operation completed successfully',
    colorPalette: 'green',
  },
};

export const RedTheme: Story = {
  args: {
    title: 'Error Page',
    subtitle: 'Something went wrong',
    colorPalette: 'red',
  },
};

export const PurpleTheme: Story = {
  args: {
    title: 'Premium Features',
    subtitle: 'Unlock advanced functionality',
    colorPalette: 'purple',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <Header
        title="Blue Header"
        subtitle="Default theme"
        colorPalette="blue"
      />
      <Header
        title="Green Header"
        subtitle="Success theme"
        colorPalette="green"
      />
      <Header
        title="Red Header"
        subtitle="Error theme"
        colorPalette="red"
      />
      <Header
        title="Purple Header"
        subtitle="Premium theme"
        colorPalette="purple"
      />
      <Header
        title="Gray Header"
        subtitle="Neutral theme"
        colorPalette="gray"
      />
    </div>
  ),
};