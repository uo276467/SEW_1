import xml.etree.ElementTree as ET

# Función para convertir las coordenadas del XML a un archivo SVG
def xml_to_svg(xml_file, svg_file):
    # Leer el archivo XML
    tree = ET.parse(xml_file)
    root = tree.getroot()

    # Crear el contenido SVG
    svg_content = ['<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">']
    
    # Obtener los puntos
    puntos = root.find('puntos')
    coordenadas = []
    
    # Recorrer los tramos y extraer las coordenadas
    for tramo in puntos.findall('tramo'):
        coord = tramo.find('coordenadas')
        longitud = float(coord.get('longitud'))
        latitud = float(coord.get('latitud'))
        
        # Convertir las coordenadas a un sistema de coordenadas SVG
        # Ajustar los valores de longitud y latitud a las dimensiones del SVG
        # Para este ejemplo, haremos un simple escalado y traslación
        x = (longitud + 5) * 100  # Escalar y trasladar
        y = (55 - latitud) * 100   # Escalar y trasladar (invertir Y)
        
        coordenadas.append((x, y))
        
        # Agregar un círculo para cada punto
        svg_content.append(f'<circle cx="{x}" cy="{y}" r="5" fill="blue" />')

    # Dibujar líneas entre los puntos
    for i in range(1, len(coordenadas)):
        x1, y1 = coordenadas[i - 1]
        x2, y2 = coordenadas[i]
        svg_content.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="black" stroke-width="2" />')

    svg_content.append('</svg>')
    
    # Guardar el contenido SVG en un archivo
    with open(svg_file, 'w') as f:
        f.write('\n'.join(svg_content))

# Ruta al archivo XML de entrada y al archivo SVG de salida
xml_file = 'circuitoEsquema.xml'  # Cambia esto por el nombre de tu archivo XML
svg_file = 'output.svg'

# Llamar a la función
xml_to_svg(xml_file, svg_file)
