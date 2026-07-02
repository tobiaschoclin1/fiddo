// Buscar categoría leaf válida
async function findCategory() {
  try {
    // Libros es típicamente simple
    const response = await fetch('https://api.mercadolibre.com/sites/MLA/categories');
    const categories = await response.json();

    // Buscar Libros
    const libros = categories.find(c => c.name.includes('Libros'));
    if (!libros) {
      console.log('Categorías disponibles:', categories.map(c => `${c.id}: ${c.name}`).join('\n'));
      return;
    }

    const subResponse = await fetch(`https://api.mercadolibre.com/categories/${libros.id}`);
    const subData = await subResponse.json();

    console.log('Categoría Libros:', libros.id);
    console.log('Children leaf:', subData.children_categories?.filter(c => c.total_items_in_this_category > 0)[0]);

  } catch (error) {
    console.error('Error:', error);
  }
}

findCategory();
