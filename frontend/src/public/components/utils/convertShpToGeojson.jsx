const convertShpToGeojson = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        // Untuk file ZIP (berisi SHP)
        if (file.name.endsWith('.zip')) {
          // Import library secara dinamis
          const JSZip = await import('jszip');
          const shp = await import('shpjs');
          
          const zip = await JSZip.default().loadAsync(e.target.result);
          const files = Object.keys(zip.files);
          
          // Cari file .shp dan .dbf
          const shpFile = files.find(f => f.endsWith('.shp'));
          const dbfFile = files.find(f => f.endsWith('.dbf'));
          
          if (!shpFile) {
            throw new Error('File .shp tidak ditemukan di dalam ZIP');
          }
          
          // Baca file SHP dan DBF
          const shpData = await zip.file(shpFile).async('arraybuffer');
          const dbfData = dbfFile ? await zip.file(dbfFile).async('arraybuffer') : null;
          
          // Konversi ke GeoJSON
          const geojson = await shp.default(shpData, dbfData);
          resolve(geojson);
        } 
        // Untuk file GeoJSON langsung
        else if (file.name.endsWith('.geojson') || file.name.endsWith('.json')) {
          const content = e.target.result;
          const geojson = JSON.parse(content);
          resolve(geojson);
        }
        // Untuk file SHP langsung (tanpa ZIP)
        else if (file.name.endsWith('.shp')) {
          const shp = await import('shpjs');
          const arrayBuffer = e.target.result;
          const geojson = await shp.default(arrayBuffer);
          resolve(geojson);
        }
        else {
          throw new Error('Format file tidak didukung. Gunakan .zip, .shp, .geojson, atau .json');
        }
      } catch (error) {
        console.error('Error converting SHP:', error);
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Gagal membaca file'));
    };
    
    // Baca file sesuai tipe
    if (file.name.endsWith('.zip')) {
      reader.readAsArrayBuffer(file);
    } else if (file.name.endsWith('.geojson') || file.name.endsWith('.json')) {
      reader.readAsText(file);
    } else if (file.name.endsWith('.shp')) {
      reader.readAsArrayBuffer(file);
    } else {
      reject(new Error('Format file tidak didukung'));
    }
  });
};

export { convertShpToGeojson };