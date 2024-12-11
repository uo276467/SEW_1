import xml.etree.ElementTree as ET

class Kml(object):
    """
    Genera archivo KML con puntos y líneas
    """
    def __init__(self):
        self.raiz = ET.Element('kml', xmlns="http://www.opengis.net/kml/2.2")
        self.doc = ET.SubElement(self.raiz,'Document')

    def addPlacemark(self,nombre,descripcion,long,lat,alt, modoAltitud):
        # Añadir elemento Placemark
        pm = ET.SubElement(self.doc,'Placemark')
        ET.SubElement(pm,'name').text = '\n' + nombre + '\n'
        ET.SubElement(pm,'description').text = '\n' + descripcion + '\n'
        punto = ET.SubElement(pm,'Point')
        ET.SubElement(punto,'coordinates').text = '\n{},{},{}\n'.format(long,lat,alt)
        ET.SubElement(punto,'altitudeMode').text = '\n' + modoAltitud + '\n'

        # Agregar elemento LineString
        line_string = ET.SubElement(pm, 'LineString')
        ET.SubElement(line_string, 'extrude').text = '1'
        ET.SubElement(line_string, 'tessellate').text = '1'
        ET.SubElement(line_string, 'coordinates').text = f'\n{long},{lat},{alt}'

    def escribir(self,nombreArchivoKML):
        arbol = ET.ElementTree(self.raiz)
        arbol.write(nombreArchivoKML, encoding='utf-8', xml_declaration=True)

def procesar_xml_a_kml(xml_file, kml_file):
    # Parsear el archivo XML
    tree = ET.parse(xml_file)
    root = tree.getroot()

    # Crear instancia del objeto Kml
    kml = Kml()

    # Extraer la información de los tramos y sus coordenadas
    puntos = root.find('puntos')
    if puntos is not None:
        tramos = puntos.findall('tramo')
        previous_placemark = None
        for tramo in tramos:
            distancia = tramo.find('distancia').attrib['valor'] + " " + tramo.find('distancia').attrib['unidades']
            coordenadas = tramo.find('coordenadas')
            longitud = coordenadas.attrib.get('longitud')
            latitud = coordenadas.attrib.get('latitud')
            altitud = coordenadas.attrib.get('altitud', '0').replace('m', '')
            sector = tramo.find('sector').text

            # Agregar las coordenadas al último elemento LineString del Placemark anterior
            if previous_placemark:
                previous_placemark.find('LineString').find('coordinates').text += f' {longitud},{latitud},{altitud}'

            # Añadir un placemark por cada tramo
            kml.addPlacemark(f"Tramo Sector {sector}",
                             f"Distancia: {distancia}",
                             longitud, latitud, altitud,
                             'relativeToGround')
            
            previous_placemark = kml.doc[-1]  # Guardar el último Placemark para la siguiente iteración

    # Guardar el archivo KML
    kml.escribir(kml_file)

def main():
    # Nombre del archivo XML y del archivo KML de salida    
    xml_file = "circuitoEsquema.xml"
    kml_file = "circuito.kml"

    # Procesar el XML y generar el archivo KML
    procesar_xml_a_kml(xml_file, kml_file)

    print(f"Archivo KML creado: {kml_file}")

if __name__ == "__main__":
    main()
