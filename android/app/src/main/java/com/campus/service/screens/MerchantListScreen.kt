package com.campus.service.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
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
import com.campus.service.network.Merchant
import com.campus.service.network.RetrofitClient
import kotlinx.coroutines.launch

@Composable
fun MerchantListScreen(navController: NavController) {
    var merchants by remember { mutableStateOf<List<Merchant>>(emptyList()) }
    val scope = rememberCoroutineScope()

    LaunchedEffect(Unit) {
        scope.launch {
            try {
                val response = RetrofitClient.apiService.getMerchants()
                if (response.isSuccessful) {
                    merchants = response.body()?.data ?: emptyList()
                }
            } catch (_: Exception) {}
        }
    }

    Column(modifier = Modifier.fillMaxSize().background(Color(0xFFF5F5F7))) {
        Text("订餐", fontSize = 24.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(20.dp))

        LazyColumn(modifier = Modifier.padding(horizontal = 16.dp)) {
            items(merchants) { merchant ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 12.dp)
                        .clickable { navController.navigate("merchant/${merchant.id}") },
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(56.dp)
                                .background(Color(0xFFE8E8ED), RoundedCornerShape(14.dp)),
                            contentAlignment = Alignment.Center
                        ) { Text("🍜", fontSize = 28.sp) }
                        Spacer(Modifier.width(16.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(merchant.name, fontSize = 16.sp, fontWeight = FontWeight.SemiBold)
                            Text(merchant.area ?: "", fontSize = 13.sp, color = Color.Gray)
                        }
                        Text("›", fontSize = 20.sp, color = Color.Gray)
                    }
                }
            }
        }
    }
}
