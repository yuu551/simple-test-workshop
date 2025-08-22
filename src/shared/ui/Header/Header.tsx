import React from 'react';
import { Heading, Text, Box } from '@chakra-ui/react';

export interface HeaderProps {
  title: string;
  subtitle?: string;
  colorPalette?: 'blue' | 'green' | 'red' | 'purple' | 'gray';
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  colorPalette = 'blue',
  className = ''
}) => {
  return (
    <Box as="header" className={className} p={6} textAlign="center">
      <Heading as="h1" size="xl" colorPalette={colorPalette} mb={2}>
        {title}
      </Heading>
      {subtitle && (
        <Text fontSize="lg" color="gray.600">
          {subtitle}
        </Text>
      )}
    </Box>
  );
};