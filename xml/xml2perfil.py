import xml.etree.ElementTree as ET

def parse_xml_and_generate_svg(xml_path, svg_path):
    # Parse the XML file
    tree = ET.parse(xml_path)
    root = tree.getroot()
    
    # Extract tramos data
    tramos = root.find("puntos").findall("tramo")
    distances = []
    altitudes = []
    
    cumulative_distance = 0
    for tramo in tramos:
        distancia = float(tramo.find("distancia").get("valor"))
        altitud = float(tramo.find("coordenadas").get("altitud"))
        
        cumulative_distance += distancia
        distances.append(cumulative_distance)
        altitudes.append(altitud)
    
    # Define SVG parameters
    width, height = 800, 400
    margin = 50
    max_distance = max(distances)
    min_altitude = min(altitudes)
    max_altitude = max(altitudes)
    
    # Scale data to fit SVG
    def scale_x(x):
        return margin + (x / max_distance) * (width - 2 * margin)

    def scale_y(y):
        return height - margin - ((y - min_altitude) / (max_altitude - min_altitude)) * (height - 2 * margin)
    
    # Create SVG elements
    svg_elements = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">',
        f'<rect width="{width}" height="{height}" fill="white" stroke="black"/>'
    ]
    
    # Draw axes
    svg_elements.append(f'<line x1="{margin}" y1="{margin}" x2="{margin}" y2="{height - margin}" stroke="black" />')  # Y-axis
    svg_elements.append(f'<line x1="{margin}" y1="{height - margin}" x2="{width - margin}" y2="{height - margin}" stroke="black" />')  # X-axis
    
    # Plot the altimetry line
    points = " ".join(f"{scale_x(x)},{scale_y(y)}" for x, y in zip(distances, altitudes))
    svg_elements.append(f'<polyline points="{points}" fill="none" stroke="blue" stroke-width="2"/>')
    
    # Add labels
    svg_elements.append(f'<text x="{width / 2}" y="{margin / 2}" text-anchor="middle" font-size="14" fill="black">Altimetria del Circuito Silverstone</text>')
    
    # Close SVG
    svg_elements.append('</svg>')
    
    # Write SVG to file
    with open(svg_path, "w") as svg_file:
        svg_file.write("\n".join(svg_elements))
    print(f"SVG generado en: {svg_path}")

# Ruta del archivo XML y SVG
xml_file = "circuitoEsquema.xml"
svg_file = "altimetria.svg"

# Generar el SVG
parse_xml_and_generate_svg(xml_file, svg_file)
