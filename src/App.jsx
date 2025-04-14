import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import LoginPage from './pages/LoginPage'
import PurchaseOrdersPage from './pages/PurchaseOrdersPage'
import PurchaseOrderForm from './components/PurchaseOrderForm'
import PurchaseOrderDetail from './components/PurchaseOrderDetail'

function PrivateWrapper({ children, requiredRole }) {
  return (
    <PrivateRoute requiredRole={requiredRole}>
      {children}
    </PrivateRoute>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/purchase-orders"
            element={
              <PrivateWrapper>
                <PurchaseOrdersPage />
              </PrivateWrapper>
            }
          />
          <Route
            path="/purchase-orders/new"
            element={
              <PrivateWrapper>
                <PurchaseOrderForm />
              </PrivateWrapper>
            }
          />
          <Route
            path="/purchase-orders/:id"
            element={
              <PrivateWrapper requiredRole="reviewer">
                <PurchaseOrderDetail />
              </PrivateWrapper>
            }
          />
          <Route path="/" element={<Navigate to="/purchase-orders" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
