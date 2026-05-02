import { useContext } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { CartContext } from '../../context/CartContext';

export default function CartScreen() {
  const { cart, removeFromCart, getTotal } = useContext(CartContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Cart</Text>

      {cart.length === 0 ? (
        <Text>No items in cart</Text>
      ) : (
        cart.map((item, index) => (
          <View key={index} style={styles.itemBox}>
            <Text>{item.name}</Text>
            <Text>₱{item.price}</Text>
            <Button title="Remove" onPress={() => removeFromCart(index)} />
          </View>
        ))
      )}

      <Text style={styles.total}>Total: ₱{getTotal()}</Text>

      <Button
        title="Checkout"
        onPress={() => alert("Order placed successfully!")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold' },
  itemBox: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#ddd',
    borderRadius: 8,
  },
  total: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
});