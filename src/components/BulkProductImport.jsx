import React, { useMemo, useState } from 'react';
import { useProducts } from '../context/useProducts';
import { useCart } from '../context/useCart';
import { FileSpreadsheet, Upload, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';

const norm = (v) => String(v ?? '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '');
const pick = (row, aliases) => {
  const keys = Object.keys(row);
  const key = keys.find((k) => aliases.includes(norm(k)));
  return key ? row[key] : '';
};
const truthy = (v) => ['yes','true','1','y','online','show'].includes(String(v ?? '').trim().toLowerCase());

export const BulkProductImport = () => {
  const { products = [], categories = [], bulkAddProducts } = useProducts();
  const { showNotification } = useCart();
  const [fileName, setFileName] = useState('');
  const [rows, setRows] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const validCategories = categories.filter((c) => c && c.id !== 'all');
  const [categoryOverrides, setCategoryOverrides] = useState({});

  const existingKeys = useMemo(() => new Set(products.map((p) => norm(p.name)+'|'+norm(p.category))), [products]);
  const prepared = useMemo(() => rows.map((r, i) => {
    const catId = categoryOverrides[i] || r.categoryId;
    const cat = validCategories.find((c) => c.id === catId);
    return { ...r, categoryId: catId, categoryName: cat?.name || r.categoryName, categoryValid: !!cat };
  }), [rows, categoryOverrides, categories]);

  const validRows = prepared.filter((r) => r.name && Number.isFinite(r.price) && r.price > 0 && r.categoryValid);
  const duplicateCount = validRows.filter((r) => existingKeys.has(norm(r.name)+'|'+norm(r.categoryId))).length;
  const importRows = validRows.filter((r) => !existingKeys.has(norm(r.name)+'|'+norm(r.categoryId)));

  const handleFile = async (file) => {
    if (!file) return;
    setLoading(true); setRows([]); setIssues([]); setCategoryOverrides({});
    try {
      const buffer = await file.arrayBuffer();
      const XLSX = window.XLSX;
      if (!XLSX) throw new Error('Excel reader failed to load. Refresh the page and try again.');
      const workbook = XLSX.read(buffer, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const source = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false });
      if (!source.length) throw new Error('The selected worksheet has no product rows.');
      const categoryMap = (value) => {
        const v = norm(value);
        let found = validCategories.find((c) => norm(c.id) === v || norm(c.name) === v);
        const aliases = {
          'ramssd':'storage-ram','memory':'storage-ram','ssd':'storage-ram','pendrive':'storage-ram',
          'harddisk':'hard-disk','hdd':'hard-disk','processor':'cpus','cpu':'cpus','graphicscard':'gpus',
          'graphiccard':'gpus','motherboard':'motherboards','smps':'power-supplies','ups':'power-supplies',
          'cabinet':'cases','case':'cases','network':'networking','router':'networking',
          'speaker':'sound-audio','headphone':'sound-audio','cable':'cables-adapters','adapter':'cables-adapters',
          'webcam':'peripherals','printer':'peripherals','keyboard':'keyboard','mouse':'mouse'
        };
        if (!found && aliases[v]) found = validCategories.find((c) => c.id === aliases[v]);
        return found;
      };
      const parsed = source.map((row, i) => {
        const name = String(pick(row,['product','productname','name','itemname','descriptionofgoods']) || '').trim();
        const rawCategory = pick(row,['websitecategory','category','productcategory','categoryname']);
        const cat = categoryMap(rawCategory);
        const company = String(pick(row,['company','brand','manufacturer','companyname']) || '').trim();
        const priceRaw = pick(row,['pricewithtax','sellingpricewithtax','taxinclusiveprice','sellingprice','price','mrp']);
        const price = Number(String(priceRaw).replace(/[₹,\s]/g,''));
        const qtyRaw = pick(row,['qty','quantity','stock','stockquantity','closingstock']);
        const stockQuantity = Math.max(0, Number(String(qtyRaw).replace(/[,\s]/g,'')) || 0);
        const showOnline = pick(row,['showonline','online','publish','visibility','active']);
        const description = String(pick(row,['productdescription','details','remarks']) || '').trim();
        const originalPriceRaw = pick(row,['originalprice','mrp','listprice']);
        const originalPrice = Number(String(originalPriceRaw).replace(/[₹,\s]/g,'')) || price;
        return { sourceRow:i+2, name, rawCategory:String(rawCategory||'').trim(), categoryId:cat?.id||'', categoryName:cat?.name||'', company:company||'Other Brands', price, originalPrice, stockQuantity, showOnline:showOnline==='' ? true : truthy(showOnline), description, image:'', specs:[], warranty:'', badge:'', isFeatured:false };
      });
      const problems = [];
      parsed.forEach((r) => {
        if (!r.name) problems.push(`Row ${r.sourceRow}: missing product name`);
        if (!(r.price > 0)) problems.push(`Row ${r.sourceRow}: missing/invalid Price with Tax`);
        if (!r.categoryId) problems.push(`Row ${r.sourceRow}: category "${r.rawCategory || '(blank)'}" needs mapping`);
      });
      setRows(parsed); setIssues(problems); setFileName(file.name);
    } catch (e) {
      showNotification(e.message || 'Could not read this Excel file.', 'error');
    } finally { setLoading(false); }
  };

  const handleImport = async () => {
    if (!importRows.length) return;
    setImporting(true);
    try {
      const count = await bulkAddProducts(importRows.map((r) => ({
        name:r.name, company:r.company, category:r.categoryId, categoryName:r.categoryName,
        price:r.price, originalPrice:r.originalPrice, stockQuantity:r.stockQuantity,
        inStock:r.stockQuantity>0, description:r.description, image:r.image, specs:r.specs,
        warranty:r.warranty, badge:r.badge, isFeatured:false, showOnline:r.showOnline
      })));
      showNotification(`Imported ${count} products into Firebase.`, 'success');
      setRows([]); setIssues([]); setFileName(''); setCategoryOverrides({});
    } catch (e) {
      showNotification(e?.message === 'ADMIN_LOGIN_REQUIRED' ? 'Please sign in as an administrator.' : 'Import failed. Check Firebase permissions and try again.', 'error');
    } finally { setImporting(false); }
  };

  return <div className="space-y-5 max-w-6xl">
    <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
      <h3 className="text-base font-bold text-white flex items-center gap-2"><FileSpreadsheet className="w-5 h-5 text-cyan-400"/>Bulk Product Upload</h3>
      <p className="mt-2 text-sm text-slate-400">Upload .xlsx or .xls directly. Uses <strong className="text-slate-200">Price with Tax</strong> as the website selling price and imports company names as the company/subcategory grouping.</p>
      <label className="mt-4 flex flex-col items-center justify-center gap-2 border border-dashed border-cyan-500/40 rounded-xl p-6 text-center cursor-pointer hover:bg-cyan-950/20">
        <Upload className="w-6 h-6 text-cyan-400"/>
        <span className="text-sm font-semibold text-white">{loading ? 'Reading spreadsheet…' : fileName || 'Choose Excel file'}</span>
        <span className="text-xs text-slate-500">First worksheet is used. No data is saved until you click Import.</span>
        <input type="file" accept=".xlsx,.xls" className="hidden" disabled={loading||importing} onChange={(e)=>handleFile(e.target.files?.[0])}/>
      </label>
      {validCategories.length===0 && <p className="mt-3 text-amber-300 text-sm">No website categories are available. Create categories before importing.</p>}
    </div>
    {!!rows.length && <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[['Rows',rows.length],['Ready',validRows.length],['Duplicates skipped',duplicateCount],['Needs correction',rows.length-validRows.length]].map(([label,value])=><div key={label} className="p-3 rounded-xl bg-slate-950 border border-slate-800"><div className="text-xs text-slate-400">{label}</div><div className="text-xl font-bold text-white">{value}</div></div>)}
      </div>
      {!!issues.length && <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-700/40 text-amber-200 text-sm"><AlertTriangle className="inline w-4 h-4 mr-2"/>Some rows need attention. Fix category mapping below; rows missing name/price are excluded.</div>}
      <div className="rounded-xl border border-slate-800 overflow-hidden">
        <div className="px-4 py-3 bg-slate-950 text-sm font-semibold text-white">Preview (first 25 rows)</div>
        <div className="overflow-x-auto"><table className="w-full text-xs text-left"><thead className="bg-slate-950/70 text-slate-400"><tr>{['Row','Product','Company','Category mapping','Price with Tax','Qty','Online'].map(x=><th key={x} className="px-3 py-2">{x}</th>)}</tr></thead>
        <tbody>{prepared.slice(0,25).map((r,i)=><tr key={i} className="border-t border-slate-800">
          <td className="px-3 py-2 text-slate-500">{r.sourceRow}</td><td className="px-3 py-2 text-white min-w-48">{r.name||<span className="text-rose-400">Missing name</span>}</td><td className="px-3 py-2 text-slate-300">{r.company}</td>
          <td className="px-3 py-2 min-w-44"><select value={r.categoryId} onChange={(e)=>setCategoryOverrides(p=>({...p,[i]:e.target.value}))} className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white w-full"><option value="">Select category…</option>{validCategories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></td>
          <td className="px-3 py-2 text-slate-300">{Number.isFinite(r.price)&&r.price>0?'₹'+r.price.toLocaleString('en-IN'):<span className="text-rose-400">Invalid</span>}</td><td className="px-3 py-2 text-slate-300">{r.stockQuantity}</td><td className="px-3 py-2 text-slate-300">{r.showOnline?'Yes':'No'}</td>
        </tr>)}</tbody></table></div>
        {rows.length>25 && <p className="px-4 py-2 text-xs text-slate-500">Showing 25 of {rows.length} rows. All valid rows are included in the import.</p>}
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-xs text-slate-400"><CheckCircle2 className="inline w-4 h-4 mr-1 text-emerald-400"/>Existing products are not overwritten. Import is written in batches.</p>
        <button onClick={handleImport} disabled={!importRows.length||importing} className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm disabled:opacity-40 flex items-center gap-2">{importing&&<Loader2 className="w-4 h-4 animate-spin"/>}{importing?'Importing…':`Import ${importRows.length} Products`}</button>
      </div>
    </>}
  </div>;
};
