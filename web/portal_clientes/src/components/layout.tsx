/*
================================== LICENCIA ==============
====================================
MIT License
Copyright (c) 2025 José Bernardo Barquero Bonilla,
Jimmy Feng Feng,
Alexander Montero Vargas
Adrian Muñoz Alvarado,
Diego Salas Ovares.
Consulta el archivo LICENSE para más detalles.
=======================================================
=======================================
*/

/**
 * Component: Flex
 * Componente utilitario para crear contenedores flexibles.
 *
 * Props:
 * - children: Contenido a renderizar.
 * - direction: Dirección del flex ('row' | 'column').
 * - justifyContent: Justificación del contenido.
 * - alignItems: Alineación de los items.
 * - width, height, padding, margin, backgroundColor, flexGrow: Estilos CSS opcionales.
 *
 * Example:
 * <Flex direction="column" justifyContent="center">{children}</Flex>
 */

/**
 * Component: Box
 * Componente utilitario para crear cajas con estilos personalizados.
 *
 * Props:
 * - children: Contenido a renderizar.
 * - width, height, padding, margin, backgroundColor, flexGrow: Estilos CSS opcionales.
 *
 * Example:
 * <Box width="100px" backgroundColor="#eee">{children}</Box>
 */

interface FlexProps {
    children: React.ReactNode;
    direction?: 'row' | 'column'; // Flex direction: row or column
    justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
    alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch';
    width?: string;
    height?: string;
    padding?: string;
    margin?: string;
    backgroundColor?: string;
    flexGrow?: number;
}

export const Flex = ({
                  children,
                  direction = 'row',
                  justifyContent = 'flex-start',
                  alignItems = 'stretch',
                  width = 'auto',
                  height = 'auto',
                  padding = '0',
                  margin = '0',
                  backgroundColor = 'transparent',
                  flexGrow = 0,
              }: FlexProps) => {
    return (
        <div
            className="flex-container"
            style={{
                display: 'flex',
                flexDirection: direction,
                justifyContent: justifyContent,
                alignItems: alignItems,
                width: width,
                height: height,
                padding: padding,
                margin: margin,
                backgroundColor: backgroundColor,
                flexGrow: flexGrow,
            }}
        >
            {children}
        </div>
    );
};

interface BoxProps {
    children: React.ReactNode;
    width?: string;
    height?: string;
    padding?: string;
    margin?: string;
    backgroundColor?: string;
    flexGrow?: number;
}

export const Box = ({
                 children,
                 width = 'auto',
                 height = 'auto',
                 padding = '0',
                 margin = '0',
                 backgroundColor = 'transparent',
                 flexGrow = 0,
             }: BoxProps) => {
    return (
        <div
            className="box"
            style={{
                width: width,
                height: height,
                padding: padding,
                margin: margin,
                backgroundColor: backgroundColor,
                flexGrow: flexGrow,
            }}
        >
            {children}
        </div>
    );
};