package com.campus.service.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.campus.service.network.Product
import com.campus.service.network.RetrofitClient
import kotlinx.coroutines.launch

@Composable
fun MenuScreen(navController: NavController, merchantId: Int) {
    var products by remember { mutableStateOf<List<Product>>(emptyList()) }
    var cart by remember { mutableStateOf<Map<Int, Int>>(emptyMap()) }
    val scope = rememberCoroutineScope()

    LaunchedEffect(merchantId) {
        scope.launch {
            try {
                val response = RetrofitClient.apiService.getProducts(merchantId)
                if (response.isSuccessful) {
                    products = response.body()?.data ?: emptyList()
                }
            } catch (_: Exception) {}
        }
    }

    val totalCount = cart.values.sum()
    val totalAmount = products.filter { cart.containsKey(it.id) }.sumOf { it.price * (cart[it.id] ?: 0) }

    Column(modifier = Modifier.fillMaxSize().background(Color(0xFFF5F5F7))) {
        LazyColumn(modifier = Modifier.weight(1f).padding(16.dp)) {
            items(products) { product ->
                Card(
                    modifier = Modifier.fillMaxWidth().padding(bottom = 12.dp),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Row(modifier = Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(64.dp)
                                .background(Color(0xFFE8E8ED), RoundedCornerShape(12.dp)),
                            contentAlignment = Alignment.Center
                        ) { Text("🍜", fontSize = 32.sp) }
                        Spacer(Modifier.width(16.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(product.name, fontSize = 15.sp, fontWeight = FontWeight.SemiBold)
                            Text(product.description ?: "", fontSize = 12.sp, color = Color.Gray)
                            Text("¥${product.price}", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1D1D1F), modifier = Modifier.padding(top = 4.dp))
                        }
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            val qty = cart[product.id] ?: 0
                            if (qty > 0) {
                                IconButton(onClick = { cart = cart.toMutableMap().apply { if (qty > 1) set(product.id, qty - 1) else remove(product.id) } }) {
                                    Text("−", fontSize = 18.sp, fontWeight = FontWeight.Bold)
                                }
                                Text("$qty", fontSize = 16.sp, fontWeight = FontWeight.SemiBold, modifier = Modifier.padding(horizontal = 8.dp))
                            }
                            IconButton(onClick = { cart = cart.toMutableMap().apply { set(product.id, qty + 1) } }) {
                                Text("+", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color.White, modifier = Modifier.background(Color(0xFF1D1D1F), RoundedCornerShape(8.dp)).padding(4.dp))
                            }
                        }
                    }
                }
            }
        }

        // Cart bar
        if (totalCount > 0) {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(topStart = 16.dp, topEnd = 16.dp)
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column {
                        Text("¥${String.format("%.2f", totalAmount)}", fontSize = 20.sp, fontWeight = FontWeight.Bold)
                        Text("共 $totalCount 件", fontSize = 12.sp, color = Color.Gray)
                    }
                    Button(
                        onClick = { /* checkout */ },
                        shape = RoundedCornerShape(980.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0071E3))
                    ) {
                        Text("去结算", modifier = Modifier.padding(horizontal = 24.dp))
                    }
                }
            }
        }
    }
}
