import { StitchClient } from "../stitch-client.js";
import { ComponentProp, GeneratedComponent } from "../types.js";

/**
 * Generate React component code from Stitch design
 */
export async function generateReact(
  args: {
    componentId: string;
    includeTests?: boolean;
    styleFormat?: "scss-module" | "css-module" | "styled-components";
  },
  client: StitchClient
): Promise<GeneratedComponent> {
  const { componentId, includeTests = false, styleFormat = "scss-module" } = args;

  // Fetch component spec and styles
  const component = await client.getComponent(componentId);
  const styles = await client.getComponentStyles(componentId);

  const componentName = component.name;
  const kebabName = toKebabCase(componentName);

  // Generate files
  const result: GeneratedComponent = {
    component: {
      filename: `${componentName}.tsx`,
      code: generateComponentCode(component, styleFormat),
    },
    styles: {
      filename: `${kebabName}.module.${styleFormat === "scss-module" ? "scss" : "css"}`,
      code: generateStyleCode(component, styles, styleFormat),
    },
    index: {
      filename: "index.ts",
      code: `export { ${componentName} } from './${componentName}';\n`,
    },
  };

  if (includeTests) {
    result.tests = {
      filename: `${componentName}.test.tsx`,
      code: generateTestCode(component),
    };
  }

  return result;
}

/**
 * Generate React component TypeScript code
 */
function generateComponentCode(component: any, styleFormat: string): string {
  const componentName = component.name;
  const kebabName = toKebabCase(componentName);
  const props = component.props || [];

  const propsInterface = generatePropsInterface(componentName, props);
  const propsList = props.map((p: ComponentProp) => p.name).join(",\n  ");

  const styleImport =
    styleFormat === "styled-components"
      ? ""
      : `import styles from './${kebabName}.module.${styleFormat === "scss-module" ? "scss" : "css"}';\n`;

  return `import React from 'react';
${styleImport}
${propsInterface}

/**
 * ${component.description || componentName}
 * 
 * @component
 */
export const ${componentName}: React.FC<${componentName}Props> = ({
  ${propsList}
}) => {
  return (
    <div className={styles.${kebabName}}>
      {/* TODO: Implement component based on Stitch design */}
    </div>
  );
};
`;
}

/**
 * Generate TypeScript props interface
 */
function generatePropsInterface(componentName: string, props: ComponentProp[]): string {
  if (!props || props.length === 0) {
    return `interface ${componentName}Props {}`;
  }

  const propLines = props.map((prop) => {
    const optional = prop.required ? "" : "?";
    const description = prop.description ? `\n  /** ${prop.description} */` : "";
    return `${description}\n  ${prop.name}${optional}: ${prop.type};`;
  });

  return `interface ${componentName}Props {${propLines.join("")}\n}`;
}

/**
 * Generate SCSS/CSS module code
 */
function generateStyleCode(component: any, styles: any, format: string): string {
  const kebabName = toKebabCase(component.name);

  // Base styles template
  let styleCode = `.${kebabName} {
  /* Base styles */
  display: block;
  
  /* TODO: Add styles from Stitch design */
`;

  // Add CSS variables if available
  if (styles?.variables) {
    styleCode += "\n  /* Design tokens */\n";
    Object.entries(styles.variables).forEach(([key, value]) => {
      styleCode += `  ${key}: ${value};\n`;
    });
  }

  styleCode += "}\n";

  // Add variant styles if available
  if (component.variants && component.variants.length > 0) {
    styleCode += "\n/* Variants */\n";
    component.variants.forEach((variant: any) => {
      styleCode += `.${kebabName}--${toKebabCase(variant.name)} {\n  /* ${variant.description || variant.name} */\n}\n\n`;
    });
  }

  return styleCode;
}

/**
 * Generate test file code
 */
function generateTestCode(component: any): string {
  const componentName = component.name;

  return `import { render, screen } from '@testing-library/react';
import { ${componentName} } from './${componentName}';

describe('${componentName}', () => {
  it('renders without crashing', () => {
    render(<${componentName} />);
  });

  // TODO: Add more tests based on component props and behavior
});
`;
}

/**
 * Convert string to kebab-case
 */
function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}
