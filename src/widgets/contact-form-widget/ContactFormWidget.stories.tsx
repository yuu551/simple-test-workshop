import type { Meta, StoryObj } from '@storybook/react';
import { ContactFormWidget } from './ContactFormWidget';

const meta: Meta<typeof ContactFormWidget> = {
  component: ContactFormWidget,
  title: 'widgets/ContactFormWidget',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ContactFormWidget>;

export const Default: Story = {};

export const InContainer: Story = {
  decorators: [
    (Story) => (
      <div style={{ padding: '2rem', background: '#f5f5f5', minHeight: '100vh' }}>
        <Story />
      </div>
    ),
  ],
};