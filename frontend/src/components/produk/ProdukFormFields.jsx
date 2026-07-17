import FormGroup from '../form/FormGroup.jsx'
import TextInput from '../form/TextInput.jsx'
import TextArea from '../form/TextArea.jsx'
import SelectInput from '../form/SelectInput.jsx'
import DateInput from '../form/DateInput.jsx'
import FileDropzone from '../form/FileDropzone.jsx'
import FormActions from '../form/FormActions.jsx'
import { KATEGORI_OPTIONS, STORAGE_OPTIONS } from './produkFormConfig.js'

export default function ProdukFormFields({
  form, updateField, setForm, foto, setFoto,
  error, onCancel, onSubmit, submitLabel,
}) {
  return (
    <div className="tambah-produk__body">
      <div className="tambah-produk__main">
        <section className="form-card">
          <div className="form-card__top-grid">
            <div className="form-card__col">
              <h3 className="form-card__heading">Informasi Produk</h3>

              <FormGroup label="Nama produk" htmlFor="namaProduk">
                <TextInput
                  id="namaProduk"
                  placeholder="Contoh: tomat"
                  value={form.namaProduk}
                  onChange={updateField('namaProduk')}
                />
              </FormGroup>

              <FormGroup label="Kategori" htmlFor="kategori">
                <SelectInput
                  id="kategori"
                  placeholder="Pilih Kategori"
                  options={KATEGORI_OPTIONS}
                  value={form.kategori}
                  onChange={updateField('kategori')}
                />
              </FormGroup>

              <FormGroup label="Cara penyimpanan" htmlFor="storageMethod">
                <SelectInput
                  id="storageMethod"
                  placeholder="Pilih cara simpan"
                  options={STORAGE_OPTIONS}
                  value={form.storageMethod}
                  onChange={updateField('storageMethod')}
                />
              </FormGroup>

              <FormGroup label="Tanggal panen" htmlFor="tanggalPanen">
                <DateInput
                  id="tanggalPanen"
                  value={form.tanggalPanen}
                  onChange={updateField('tanggalPanen')}
                />
              </FormGroup>

              <FormGroup label="">
                <label className="tambah-produk__checkbox">
                  <input
                    type="checkbox"
                    checked={form.hygienic}
                    onChange={(e) => setForm((prev) => ({ ...prev, hygienic: e.target.checked }))}
                  />
                  <span>Produk ditangani secara higienis</span>
                </label>
              </FormGroup>
            </div>

            <div className="form-card__col">
              <h3 className="form-card__heading">Deskripsi Produk</h3>
              <FormGroup>
                <TextArea
                  placeholder="Jelaskan tentang produk Anda (asal, daerah, kualitas, dll.)"
                  className="tambah-produk__deskripsi"
                  value={form.deskripsi}
                  onChange={updateField('deskripsi')}
                />
              </FormGroup>
            </div>
          </div>

          <hr className="form-card__divider" />

          <div className="form-card__foto">
            <h3 className="form-card__heading">Foto Produk</h3>
            <FileDropzone onFileSelect={setFoto} />
          </div>
        </section>

        {error && <div className="tambah-produk__error">{error}</div>}

        <FormActions onCancel={onCancel} onSubmit={onSubmit} submitLabel={submitLabel} />
      </div>

      <aside className="tambah-produk__side">
        <section className="form-card form-card--detail">
          <h3 className="form-card__heading">Detail Produk</h3>

          <FormGroup label="Harga / kg (Rp)" htmlFor="harga">
            <TextInput
              id="harga"
              placeholder="Contoh: 28000"
              value={form.harga}
              onChange={updateField('harga')}
            />
          </FormGroup>

          <FormGroup label="Stok tersedia (kg)" htmlFor="stok">
            <TextInput
              id="stok"
              placeholder="Contoh: 20"
              value={form.stok}
              onChange={updateField('stok')}
            />
          </FormGroup>

          <FormGroup label="Minimum Order (kg)" htmlFor="minimumOrder">
            <TextInput
              id="minimumOrder"
              placeholder="Contoh: 10"
              value={form.minimumOrder}
              onChange={updateField('minimumOrder')}
            />
          </FormGroup>

          <FormGroup label="Lokasi Asal" htmlFor="lokasiAsal">
            <TextInput
              id="lokasiAsal"
              placeholder="Contoh: Jayapura, Papua"
              value={form.lokasiAsal}
              onChange={updateField('lokasiAsal')}
            />
          </FormGroup>

          <FormGroup label="Pengiriman" htmlFor="pengiriman">
            <TextArea
              id="pengiriman"
              placeholder="Contoh: Dikirim via ekspedisi, ongkir ditanggung pembeli"
              className="tambah-produk__pengiriman"
              value={form.pengiriman}
              onChange={updateField('pengiriman')}
            />
          </FormGroup>
        </section>

        <div className="tambah-produk__ai-info">
          <div className="tambah-produk__ai-icon">🤖</div>
          <div>
            <p className="tambah-produk__ai-title">Prediksi AI Otomatis</p>
            <p className="tambah-produk__ai-desc">
              Setelah disimpan, AI kami akan memprediksi tier kesegaran produk kamu
              (Fresh / Standard / Rescue) berdasarkan jenis produk, cara simpan,
              hari sejak panen, dan higienitas.
            </p>
          </div>
        </div>
      </aside>
    </div>
  )
}
