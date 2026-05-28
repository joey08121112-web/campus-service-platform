package com.campus.service.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController

data class ServiceItem(val name: String, val emoji: String, val route: String)

@Composable
fun HomeScreen(navController: NavController) {
    val services = listOf(
        ServiceItem("订餐", "🍜", "merchants"),
        ServiceItem("打印", "🖨️", "print"),
        ServiceItem("零食", "🍪", "snack"),
        ServiceItem("代取", "🛵", "takeout"),
        ServiceItem("快递", "📦", "express"),
        ServiceItem("搬运", "🧳", "moving"),
        ServiceItem("闲置", "♻️", "idle"),
        ServiceItem("兼职", "💼", "parttime"),
        ServiceItem("商家", "🏪", "login")
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF5F5F7))
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        // Hero
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(20.dp)
        ) {
            Column(modifier = Modifier.padding(24.dp)) {
                Text("校园综合服务", fontSize = 12.sp, color = Color.Gray)
                Spacer(Modifier.height(4.dp))
                Text("一站式校园生活平台", fontSize = 28.sp, fontWeight = FontWeight.Bold, letterSpacing = (-0.5).sp)
                Spacer(Modifier.height(6.dp))
                Text("订餐、打印、零食、代取、快递、搬运", fontSize = 14.sp, color = Color.Gray)
            }
        }

        Spacer(Modifier.height(24.dp))

        // Services
        Text("服务", fontSize = 20.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(start = 4.dp, bottom = 12.dp))

        Card(shape = RoundedCornerShape(16.dp)) {
            LazyVerticalGrid(
                columns = GridCells.Fixed(3),
                modifier = Modifier.height(280.dp),
                userScrollEnabled = false
            ) {
                items(services) { service ->
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier
                            .clickable { navController.navigate(service.route) }
                            .padding(vertical = 18.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(56.dp)
                                .clip(RoundedCornerShape(16.dp))
                                .background(Color(0xFFE8E8ED)),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(service.emoji, fontSize = 28.sp)
                        }
                        Spacer(Modifier.height(8.dp))
                        Text(service.name, fontSize = 13.sp, fontWeight = FontWeight.Medium)
                    }
                }
            }
        }

        Spacer(Modifier.height(24.dp))

        // Merchants
        Row(
            modifier = Modifier.fillMaxWidth().padding(start = 4.dp, end = 4.dp, bottom = 12.dp),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text("推荐商家", fontSize = 20.sp, fontWeight = FontWeight.Bold)
            Text("查看全部", fontSize = 14.sp, color = Color(0xFF0066CC), modifier = Modifier.clickable { navController.navigate("merchants") })
        }

        LazyRow(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            items(3) {
                Card(shape = RoundedCornerShape(14.dp), modifier = Modifier.width(160.dp)) {
                    Column {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(100.dp)
                                .background(Color(0xFFE8E8ED)),
                            contentAlignment = Alignment.Center
                        ) { Text("🍜", fontSize = 36.sp) }
                        Column(modifier = Modifier.padding(12.dp)) {
                            Text("川味窗口", fontSize = 14.sp, fontWeight = FontWeight.SemiBold)
                            Text("一食堂", fontSize = 11.sp, color = Color.Gray)
                        }
                    }
                }
            }
        }
    }
}
