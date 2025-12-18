// const LOCAL_BASE = "http://localhost:3001";
// const RENDER_BASE = "https://quickbite-fooddeliveryapp.onrender.com";

// const JSON_SERVER_BASE =
//   window.location.hostname === "localhost" ? LOCAL_BASE : RENDER_BASE;

const JSON_SERVER_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:3001";
export const FetchAllCuisines = async (cuisine) => {
  const trimmed = cuisine && cuisine.trim();
  const url =
    !trimmed || trimmed === "All"
      ? `${JSON_SERVER_BASE}/menuItems`
      : `${JSON_SERVER_BASE}/menuItems?cuisine=${encodeURIComponent(trimmed)}`;

  const response = await fetch(url);
  if (!response.ok) {
    console.error("failed to fetch from json server");
    return [];
  }

  const data = await response.json();
  return data || [];
};
export const FetchSingleFood = async (id) => {
  const res = await fetch(`${JSON_SERVER_BASE}/menuItems/${id}`);
  if (!res.ok) {
    console.error("failed to fetch single food item from json server");
    return null;
  }
  const data = await res.json();
  return data;
};

export async function FetchCart() {
  // Fetch cart rows
  const cartRes = await fetch(`${JSON_SERVER_BASE}/cart`);
  if (!cartRes.ok) {
    console.error("failed to fetch cart from json server");
    return [];
  }
  const cart = await cartRes.json();

  // Fetch all menu items to join details locally
  const itemsRes = await fetch(`${JSON_SERVER_BASE}/menuItems`);
  if (!itemsRes.ok) {
    console.error("failed to fetch menu items while building cart view");
    return cart;
  }
  const menuItems = await itemsRes.json();

  const enriched = cart.map((row) => ({
    ...row,
    menuItem:
      menuItems.find((m) => Number(m.id) === Number(row.menuItemId)) || null,
  }));

  return enriched;
}

export async function AddToCart(menuItemId, quantity = 1) {
  const existingRes = await fetch(
    `${JSON_SERVER_BASE}/cart?menuItemId=${menuItemId}`
  );
  if (!existingRes.ok) {
    console.error("failed to read cart before adding");
    return null;
  }
  const existing = await existingRes.json();
  if (existing.length > 0) {
    const item = existing[0];
    const newQty = (item.quantity || 0) + quantity;
    return UpdateCartItemQuantity(item.id, newQty);
  }

  const res = await fetch(`${JSON_SERVER_BASE}/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ menuItemId, quantity }),
  });
  if (!res.ok) {
    console.error("failed to add to cart");
    return null;
  }
  const data = await res.json();
  return data;
}

export async function UpdateCartItemQuantity(id, quantity) {
  const res = await fetch(`${JSON_SERVER_BASE}/cart/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity }),
  });
  if (!res.ok) {
    console.error("failed to update cart item quantity");
    return null;
  }
  const data = await res.json();
  return data;
}

export async function RemoveCartItem(id) {
  const res = await fetch(`${JSON_SERVER_BASE}/cart/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    console.error("failed to remove cart item");
    return false;
  }
  return true;
}

// Fetch all favorite items with attached menu details
export async function FetchFavorites() {
  const favRes = await fetch(`${JSON_SERVER_BASE}/favorites`);
  if (!favRes.ok) {
    console.error("Failed to fetch favorites");
    return [];
  }
  const favs = await favRes.json();

  const itemsRes = await fetch(`${JSON_SERVER_BASE}/menuItems`);
  if (!itemsRes.ok) {
    console.error("Failed to fetch menu items for favorites");
    return [];
  }
  const menuItems = await itemsRes.json();

  return favs.map((fav) => ({
    ...fav,
    menuItem: menuItems.find((m) => m.id === fav.menuItemId) || null,
  }));
}

export async function AddToFav(menuItemId) {
  // Check if already in favorites
  const existingRes = await fetch(
    `${JSON_SERVER_BASE}/favorites?menuItemId=${menuItemId}`
  );
  if (!existingRes.ok) {
    console.error("Failed to read favorites before adding");
    return null;
  }
  const existing = await existingRes.json();
  if (existing.length > 0) {
    return existing[0]; // Already in favorites
  }

  // Add to favorites
  const res = await fetch(`${JSON_SERVER_BASE}/favorites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ menuItemId }),
  });
  if (!res.ok) {
    console.error("Failed to add to favorites");
    return null;
  }
  const data = await res.json();
  return data;
}
export async function RemoveFromFav(id) {
  const res = await fetch(`${JSON_SERVER_BASE}/favorites/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    console.error("Failed to remove favorite item");
    return false;
  }
  return true;
}
export const ALL_CUISINES = [
  "African",
  "American",
  "British",
  "Cajun",
  "Caribbean",
  "Chinese",
  "Eastern European",
  "European",
  "French",
  "German",
  "Greek",
  "Indian",
  "Irish",
  "Italian",
  "Japanese",
  "Jewish",
  "Korean",
  "Latin American",
  "Mediterranean",
  "Mexican",
  "Middle Eastern",
  "Nordic",
  "Southern",
  "Spanish",
  "Thai",
  "Vietnamese",
];

// --------- Auth helpers (json-server demo) ----------

export async function SignUpUser(payload) {
  const { name, email, password } = payload;
  // Check if user already exists
  const existingRes = await fetch(
    `${JSON_SERVER_BASE}/users?email=${encodeURIComponent(email)}`
  );
  if (!existingRes.ok) {
    throw new Error("Unable to check existing users");
  }
  const existing = await existingRes.json();
  if (existing.length > 0) {
    throw new Error("User with this email already exists");
  }

  const res = await fetch(`${JSON_SERVER_BASE}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) {
    throw new Error("Failed to sign up");
  }
  const data = await res.json();
  return data;
}

export async function LoginUser(email, password) {
  const res = await fetch(`${JSON_SERVER_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (res.status === 401) {
    return null;
  }
  if (!res.ok) {
    throw new Error("Failed to login");
  }
  const data = await res.json();
  return data;
}
