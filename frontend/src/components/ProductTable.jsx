import './ProductTable.css'

export default function ProductTable({ products, onManage }) {
  return (
    <section className="product-table">
      <h3 className="product-table__title">Produk Terlaris</h3>

      <div className="product-table__scroll">
        <table>
          <thead>
            <tr>
              <th>Produk</th>
              <th>Stok</th>
              <th>Terjual (Bulan ini)</th>
              <th>Harga / kg</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.name}>
                <td>
                  <div className="product-table__product">
                    <span className="product-table__emoji" aria-hidden="true">{product.emoji}</span>
                    <span>{product.name}</span>
                  </div>
                </td>
                <td>{product.stock}</td>
                <td>{product.sold}</td>
                <td>{product.price}</td>
                <td>
                  <button className="product-table__manage" onClick={() => onManage?.(product)}>
                    Kelola
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
