import React from 'react';
import { Box, Text, Stack } from '@chakra-ui/react';

export interface FooterProps {
  copyright?: string;
  links?: Array<{ label: string; href: string }>;
  className?: string;
  backgroundColor?: string;
  textColor?: string;
}

export const Footer: React.FC<FooterProps> = ({
  copyright = `© ${new Date().getFullYear()} FSD Demo. Built with React + TypeScript + Storybook`,
  links = [],
  className = '',
  backgroundColor = 'gray.100',
  textColor = 'gray.700'
}) => {
  return (
    <Box 
      as="footer" 
      className={className}
      bg={backgroundColor}
      color={textColor}
      p={6}
      textAlign="center"
      borderTop="1px solid"
      borderColor="gray.200"
    >
      {links.length > 0 && (
        <Stack direction="row" justify="center" gap={6} mb={4}>
          {links.map((link, index) => (
            <Text
              key={index}
              as="a"
              href={link.href}
              fontSize="sm"
              _hover={{ textDecoration: 'underline', color: 'blue.500' }}
              cursor="pointer"
            >
              {link.label}
            </Text>
          ))}
        </Stack>
      )}
      <Text fontSize="sm">
        {copyright}
      </Text>
    </Box>
  );
};