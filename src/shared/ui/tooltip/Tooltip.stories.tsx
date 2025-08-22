import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './tooltip';
import { Button } from '@/shared/ui';

const meta = {
  title: 'Shared/UI/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: 'This is a tooltip',
    children: <Button>Hover me</Button>,
  },
};

export const WithArrow: Story = {
  args: {
    content: 'Tooltip with arrow',
    showArrow: true,
    children: <Button>Hover for tooltip with arrow</Button>,
  },
};

export const Positioning: Story = {
  args: {
    content: 'Top tooltip',
    showArrow: true,
    placement: 'top',
    children: <Button>Top tooltip</Button>,
  },
};

export const LongContent: Story = {
  args: {
    content: 'This is a very long tooltip content that demonstrates how tooltips handle longer text content gracefully.',
    showArrow: true,
    children: <Button>Hover for long tooltip</Button>,
  },
};

export const Disabled: Story = {
  args: {
    content: 'This tooltip is disabled',
    disabled: true,
    children: <Button>Disabled tooltip</Button>,
  },
};

export const AllPositions: Story = {
  render: () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(3, 1fr)', 
      gap: '2rem',
      alignItems: 'center',
      justifyItems: 'center',
      padding: '3rem'
    }}>
      <Tooltip content="Top tooltip" placement="top" showArrow>
        <Button>Top</Button>
      </Tooltip>
      <Tooltip content="Top-start tooltip" placement="top-start" showArrow>
        <Button>Top Start</Button>
      </Tooltip>
      <Tooltip content="Top-end tooltip" placement="top-end" showArrow>
        <Button>Top End</Button>
      </Tooltip>
      
      <Tooltip content="Left tooltip" placement="left" showArrow>
        <Button>Left</Button>
      </Tooltip>
      <Tooltip content="Center tooltip" showArrow>
        <Button>Center</Button>
      </Tooltip>
      <Tooltip content="Right tooltip" placement="right" showArrow>
        <Button>Right</Button>
      </Tooltip>
      
      <Tooltip content="Bottom tooltip" placement="bottom" showArrow>
        <Button>Bottom</Button>
      </Tooltip>
      <Tooltip content="Bottom-start tooltip" placement="bottom-start" showArrow>
        <Button>Bottom Start</Button>
      </Tooltip>
      <Tooltip content="Bottom-end tooltip" placement="bottom-end" showArrow>
        <Button>Bottom End</Button>
      </Tooltip>
    </div>
  ),
};