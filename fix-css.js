const fs = require('fs');
const path = require('path');

console.log('🔧 Iniciando reparación de CSS deprecated...');

function fixColorAdjust(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        let updated = content;
        let changes = 0;

        // Reemplazar todas las variantes de color-adjust
        const replacements = [
            { from: /color-adjust:\s*exact;/g, to: 'print-color-adjust: exact;' },
            { from: /color-adjust:\s*unset;/g, to: 'print-color-adjust: unset;' },
            { from: /color-adjust:\s*initial;/g, to: 'print-color-adjust: initial;' },
            { from: /color-adjust:\s*inherit;/g, to: 'print-color-adjust: inherit;' }
        ];

        replacements.forEach(({ from, to }) => {
            const matches = updated.match(from);
            if (matches) {
                updated = updated.replace(from, to);
                changes += matches.length;
            }
        });

        if (changes > 0) {
            fs.writeFileSync(filePath, updated);
            console.log(`✅ ${filePath}: ${changes} cambios realizados`);
            return changes;
        }
        
        return 0;
    } catch (error) {
        console.error(`❌ Error procesando ${filePath}:`, error.message);
        return 0;
    }
}

function scanDirectory(dir, level = 0) {
    const indent = '  '.repeat(level);
    let totalFixed = 0;
    
    try {
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
            const fullPath = path.join(dir, item);
            
            try {
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory()) {
                    // Excluir directorios innecesarios
                    if (!['node_modules', '.git', 'dist', 'build', '.next'].includes(item)) {
                        console.log(`${indent}📁 Escaneando: ${item}/`);
                        totalFixed += scanDirectory(fullPath, level + 1);
                    }
                } else if (item.endsWith('.css')) {
                    console.log(`${indent}📄 Procesando: ${item}`);
                    totalFixed += fixColorAdjust(fullPath);
                }
            } catch (statError) {
                console.warn(`⚠️  No se puede acceder a ${fullPath}: ${statError.message}`);
            }
        }
    } catch (readError) {
        console.error(`❌ Error leyendo directorio ${dir}:`, readError.message);
    }
    
    return totalFixed;
}

// Ejecutar reparación
const startTime = Date.now();
console.log('🚀 Iniciando escaneo desde ./src...\n');

const totalChanges = scanDirectory('./src');

const endTime = Date.now();
const duration = ((endTime - startTime) / 1000).toFixed(2);

console.log('\n' + '='.repeat(50));
console.log(`🎉 Reparación completada en ${duration}s`);
console.log(`📊 Total de cambios realizados: ${totalChanges}`);

if (totalChanges > 0) {
    console.log('✅ CSS actualizado a estándares modernos');
    console.log('✅ Warnings de "color-adjust" eliminados');
} else {
    console.log('ℹ️  No se encontraron problemas de CSS para arreglar');
}

console.log('\n🔍 Para verificar que no hay más warnings:');
console.log('   npm run dev');
console.log('\n📚 Para actualizar Browserslist:');
console.log('   npx update-browserslist-db@latest');
