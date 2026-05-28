struct Order: Codable, Identifiable {
    let id: Int
    let orderNo: String?
    let userId: Int?
    let merchantId: Int?
    let totalAmount: Double?
    let status: Int?
    let address: String?
    let phone: String?
    let remark: String?
    let merchantName: String?
    let items: [OrderItem]?

    enum CodingKeys: String, CodingKey {
        case id, status, address, phone, remark, items
        case orderNo = "order_no"
        case userId = "user_id"
        case merchantId = "merchant_id"
        case totalAmount = "total_amount"
        case merchantName = "merchant_name"
    }
}

struct OrderItem: Codable, Identifiable {
    let id: Int
    let productId: Int?
    let productName: String?
    let productPrice: Double?
    let quantity: Int?

    enum CodingKeys: String, CodingKey {
        case id, quantity
        case productId = "product_id"
        case productName = "product_name"
        case productPrice = "product_price"
    }
}
