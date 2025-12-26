import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS = {
  BRAND: 'brand',
  BRAND_CREATE: 'brand:create',
  BRAND_READ: 'brand:read',
  BRAND_UPDATE: 'brand:update',
  BRAND_DELETE: 'brand:delete',

  CATEGORY: 'category',
  CATEGORY_CREATE: 'category:create',
  CATEGORY_READ: 'category:read',
  CATEGORY_UPDATE: 'category:update',
  CATEGORY_DELETE: 'category:delete',

  UNIT: 'unit',
  UNIT_CREATE: 'unit:create',
  UNIT_READ: 'unit:read',
  UNIT_UPDATE: 'unit:update',
  UNIT_DELETE: 'unit:delete',

  ATTRIBUTE: 'attribute',
  ATTRIBUTE_CREATE: 'attribute:create',
  ATTRIBUTE_READ: 'attribute:read',
  ATTRIBUTE_UPDATE: 'attribute:update',
  ATTRIBUTE_DELETE: 'attribute:delete',

  MEMBER_RANK: 'member-rank',
  MEMBER_RANK_CREATE: 'member-rank:create',
  MEMBER_RANK_READ: 'member-rank:read',
  MEMBER_RANK_UPDATE: 'member-rank:update',
  MEMBER_RANK_DELETE: 'member-rank:delete',

  TAX: 'tax',
  TAX_CREATE: 'tax:create',
  TAX_READ: 'tax:read',
  TAX_UPDATE: 'tax:update',
  TAX_DELETE: 'tax:delete',

  ATTACHMENT_TYPE: 'attachment-type',
  ATTACHMENT_TYPE_CREATE: 'attachment-type:create',
  ATTACHMENT_TYPE_READ: 'attachment-type:read',
  ATTACHMENT_TYPE_UPDATE: 'attachment-type:update',
  ATTACHMENT_TYPE_DELETE: 'attachment-type:delete',

  // --- need update
  ATTACHMENT: 'attachment',
  ATTACHMENT_CREATE: 'attachment:create',
  ATTACHMENT_READ: 'attachment:read',
  ATTACHMENT_UPDATE: 'attachment:update',
  ATTACHMENT_DELETE: 'attachment:delete',

  COMPANY_PROFILE: 'company-profile',
  COMPANY_PROFILE_CREATE: 'company-profile:create',
  COMPANY_PROFILE_READ: 'company-profile:read',
  COMPANY_PROFILE_UPDATE: 'company-profile:update',
  COMPANY_PROFILE_DELETE: 'company-profile:delete',

  DASHBOARD: 'dashboard',
  // --- end need update

  MATERIAL: 'material',
  MATERIAL_CREATE: 'material:create',
  MATERIAL_READ: 'material:read',
  MATERIAL_UPDATE: 'material:update',
  MATERIAL_DELETE: 'material:delete',

  WAREHOUSE: 'warehouse',
  WAREHOUSE_CREATE: 'warehouse:create',
  WAREHOUSE_READ: 'warehouse:read',
  WAREHOUSE_UPDATE: 'warehouse:update',
  WAREHOUSE_DELETE: 'warehouse:delete',

  // 1. order-supplier (os)
  ORDER_SUPPLIER: 'order-supplier',
  ORDER_SUPPLIER_CREATE: 'order-supplier:create',
  ORDER_SUPPLIER_READ: 'order-supplier:read',
  ORDER_SUPPLIER_UPDATE: 'order-supplier:update',
  ORDER_SUPPLIER_DELETE: 'order-supplier:delete',

  // 2. purchase-order
  PURCHASE_ORDER: 'purchase-order',
  PURCHASE_ORDER_CREATE: 'purchase-order:create',
  PURCHASE_ORDER_READ: 'purchase-order:read',
  PURCHASE_ORDER_UPDATE: 'purchase-order:update',
  PURCHASE_ORDER_DELETE: 'purchase-order:delete',

  // 3. return-purchase-order
  RETURN_PURCHASE: 'return-purchase-order',
  RETURN_PURCHASE_CREATE: 'return-purchase-order:create',
  RETURN_PURCHASE_READ: 'return-purchase-order:read',
  RETURN_PURCHASE_UPDATE: 'return-purchase-order:update',
  RETURN_PURCHASE_DELETE: 'return-purchase-order:delete',

  // 4. inventory-check-oder
  INVENTORY_CHECK_ODER: 'inventory-check-oder',
  INVENTORY_CHECK_ODER_CREATE: 'inventory-check-oder:create',
  INVENTORY_CHECK_ODER_READ: 'inventory-check-oder:read',
  INVENTORY_CHECK_ODER_UPDATE: 'inventory-check-oder:update',
  INVENTORY_CHECK_ODER_DELETE: 'inventory-check-oder:delete',

  // 5. stock-out-order (soo)
  STOCK_OUT_ORDER: 'stock-out-order',
  STOCK_OUT_ORDER_CREATE: 'stock-out-order:create',
  STOCK_OUT_ORDER_READ: 'stock-out-order:read',
  STOCK_OUT_ORDER_UPDATE: 'stock-out-order:update',
  STOCK_OUT_ORDER_DELETE: 'stock-out-order:delete',

  PRODUCT: 'product',
  PRODUCT_CREATE: 'product:create',
  PRODUCT_READ: 'product:read',
  PRODUCT_UPDATE: 'product:update',
  PRODUCT_DELETE: 'product:delete',

  SIZE_SPEC: 'size-spec',
  SIZE_SPEC_CREATE: 'size-spec:create',
  SIZE_SPEC_READ: 'size-spec:read',
  SIZE_SPEC_UPDATE: 'size-spec:update',
  SIZE_SPEC_DELETE: 'size-spec:delete',

  CUSTOMER: 'customer',
  CUSTOMER_CREATE: 'customer:create',
  CUSTOMER_READ: 'customer:read',
  CUSTOMER_UPDATE: 'customer:update',
  CUSTOMER_DELETE: 'customer:delete',

  SUPPLIER: 'supplier',
  SUPPLIER_CREATE: 'supplier:create',
  SUPPLIER_READ: 'supplier:read',
  SUPPLIER_UPDATE: 'supplier:update',
  SUPPLIER_DELETE: 'supplier:delete',

  SALE_ORDER: 'sale-order',
  SALE_ORDER_CREATE: 'sale-order:create',
  SALE_ORDER_READ: 'sale-order:read',
  SALE_ORDER_UPDATE: 'sale-order:update',
  SALE_ORDER_DELETE: 'sale-order:delete',

  DEBT: 'debt',
  DEBT_CREATE: 'debt:create',
  DEBT_READ: 'debt:read',
  DEBT_UPDATE: 'debt:update',
  DEBT_DELETE: 'debt:delete',

  TRANSACTION: 'transaction',
  TRANSACTION_CREATE: 'transaction:create',
  TRANSACTION_READ: 'transaction:read',
  TRANSACTION_UPDATE: 'transaction:update',
  TRANSACTION_DELETE: 'transaction:delete',

  BANK: 'bank',
  BANK_CREATE: 'bank:create',
  BANK_READ: 'bank:read',
  BANK_UPDATE: 'bank:update',
  BANK_DELETE: 'bank:delete',

  BANK_ACCOUNT: 'bank-account',
  BANK_ACCOUNT_CREATE: 'bank-account:create',
  BANK_ACCOUNT_READ: 'bank-account:read',
  BANK_ACCOUNT_UPDATE: 'bank-account:update',
  BANK_ACCOUNT_DELETE: 'bank-account:delete',

  E_INVOICE: 'e-invoice',
  E_INVOICE_CREATE: 'e-invoice:create',
  E_INVOICE_READ: 'e-invoice:read',
  E_INVOICE_UPDATE: 'e-invoice:update',
  E_INVOICE_DELETE: 'e-invoice:delete',

  STAFF: 'staff',
  STAFF_CREATE: 'staff:create',
  STAFF_READ: 'staff:read',
  STAFF_UPDATE: 'staff:update',
  STAFF_DELETE: 'staff:delete',

  ROLE: 'role',
  ROLE_CREATE: 'role:create',
  ROLE_READ: 'role:read',
  ROLE_UPDATE: 'role:update',
  ROLE_DELETE: 'role:delete',

  PERMISSION: 'permission',
  PERMISSION_CREATE: 'permission:create',
  PERMISSION_READ: 'permission:read',
  PERMISSION_UPDATE: 'permission:update',
  PERMISSION_DELETE: 'permission:delete',
} as const;

export const PERMISSION_KEY = 'permission_key';
export const Permission = (...permissionKey: string[]) => SetMetadata(PERMISSION_KEY, permissionKey);
