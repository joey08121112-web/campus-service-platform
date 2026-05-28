package com.campus.service.network

import retrofit2.Response
import retrofit2.http.*

data class ApiResponse<T>(
    val code: Int,
    val data: T?,
    val message: String?
)

data class LoginRequest(val username: String, val password: String)
data class LoginResponse(val token: String, val merchant: MerchantInfo?)
data class MerchantInfo(val id: Int, val name: String, val area: String?)

data class User(
    val id: Int,
    val openid: String?,
    val name: String?,
    val phone: String?,
    val student_id: String?,
    val dormitory: String?,
    val room: String?
)

data class Merchant(val id: Int, val name: String, val area: String?, val image: String?, val status: Int?)
data class Product(val id: Int, val merchant_id: Int?, val name: String, val description: String?, val price: Double, val image: String?, val category: String?, val stock: Int?, val status: Int?)

data class Order(
    val id: Int, val order_no: String?, val user_id: Int?, val merchant_id: Int?,
    val total_amount: Double?, val status: Int?, val address: String?, val phone: String?,
    val remark: String?, val merchant_name: String?, val items: List<OrderItem>?
)
data class OrderItem(val id: Int, val product_id: Int?, val product_name: String?, val product_price: Double?, val quantity: Int?)

data class CreateOrderRequest(val merchant_id: Int, val items: List<OrderItemReq>, val address: String, val phone: String, val remark: String?)
data class OrderItemReq(val product_id: Int, val quantity: Int)

interface ApiService {
    @POST("user/login")
    suspend fun login(@Body request: LoginRequest): Response<ApiResponse<User>>

    @GET("user/profile")
    suspend fun getProfile(@Header("Authorization") token: String): Response<ApiResponse<User>>

    @GET("merchants")
    suspend fun getMerchants(@Query("area") area: String? = null): Response<ApiResponse<List<Merchant>>>

    @GET("merchants/{id}/products")
    suspend fun getProducts(@Path("id") id: Int): Response<ApiResponse<List<Product>>>

    @POST("orders")
    suspend fun createOrder(@Header("Authorization") token: String, @Body request: CreateOrderRequest): Response<ApiResponse<Order>>

    @GET("orders/{id}")
    suspend fun getOrderDetail(@Header("Authorization") token: String, @Path("id") id: Int): Response<ApiResponse<Order>>
}
