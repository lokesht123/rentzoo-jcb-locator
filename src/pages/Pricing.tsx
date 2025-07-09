
import { useState } from 'react';
import { Check, Star, Clock, Shield, Phone, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const [selectedEquipment, setSelectedEquipment] = useState('jcb-3dx');
  const [duration, setDuration] = useState(4);
  const [includeFuel, setIncludeFuel] = useState(false);
  const [includeOperator, setIncludeOperator] = useState(true);

  const equipmentRates = {
    'jcb-3dx': { name: 'JCB 3DX Super', baseRate: 1500, fuelRate: 300, operatorRate: 500 },
    'jcb-3cx': { name: 'JCB 3CX Eco', baseRate: 1200, fuelRate: 250, operatorRate: 400 },
    'jcb-js220': { name: 'JCB JS220', baseRate: 1800, fuelRate: 350, operatorRate: 600 },
    'excavator': { name: 'Excavator', baseRate: 2000, fuelRate: 400, operatorRate: 700 },
    'bulldozer': { name: 'Bulldozer', baseRate: 2200, fuelRate: 450, operatorRate: 750 }
  };

  const calculateTotal = () => {
    const equipment = equipmentRates[selectedEquipment as keyof typeof equipmentRates];
    let total = equipment.baseRate * duration;
    if (includeFuel) total += equipment.fuelRate * duration;
    if (includeOperator) total += equipment.operatorRate * duration;
    return total;
  };

  const plans = [
    {
      name: 'Basic',
      price: 'From ₹1,200/hour',
      description: 'Perfect for small projects',
      features: [
        'Basic equipment access',
        'Standard support',
        'Online booking',
        'Basic insurance coverage',
        'Equipment inspection'
      ],
      popular: false,
      color: 'from-gray-500 to-gray-600'
    },
    {
      name: 'Professional',
      price: 'From ₹1,500/hour',
      description: 'Most popular for medium projects',
      features: [
        'Premium equipment access',
        'Priority support',
        'Flexible scheduling',
        'Comprehensive insurance',
        'Professional operators',
        'Real-time tracking',
        'Multiple equipment types'
      ],
      popular: true,
      color: 'from-yellow-500 to-cyan-500'
    },
    {
      name: 'Enterprise',
      price: 'Custom pricing',
      description: 'For large-scale projects',
      features: [
        'All equipment access',
        'Dedicated support manager',
        'Custom contracts',
        'Bulk pricing discounts',
        'Priority booking',
        'Advanced analytics',
        'Multiple site support',
        'Extended warranties'
      ],
      popular: false,
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-cyan-50 to-yellow-100">
      <Navigation />
      
      <div className="pt-32 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-cyan-600 bg-clip-text text-transparent mb-4">
              Transparent Pricing
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Choose the perfect plan for your project needs
            </p>
          </div>

          {/* Pricing Calculator */}
          <Card className="bg-white/60 backdrop-blur-md border-white/30 shadow-xl mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-6 w-6 text-yellow-600" />
                Pricing Calculator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Equipment Type</label>
                    <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(equipmentRates).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value.name} - ₹{value.baseRate}/hour
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Duration (hours)</label>
                    <Input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      min="1"
                      max="24"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="fuel"
                        checked={includeFuel}
                        onChange={(e) => setIncludeFuel(e.target.checked)}
                        className="rounded"
                      />
                      <label htmlFor="fuel" className="text-sm">
                        Include Fuel (₹{equipmentRates[selectedEquipment as keyof typeof equipmentRates].fuelRate}/hour)
                      </label>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="operator"
                        checked={includeOperator}
                        onChange={(e) => setIncludeOperator(e.target.checked)}
                        className="rounded"
                      />
                      <label htmlFor="operator" className="text-sm">
                        Include Operator (₹{equipmentRates[selectedEquipment as keyof typeof equipmentRates].operatorRate}/hour)
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Cost Breakdown</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Equipment ({duration} hours)</span>
                      <span>₹{equipmentRates[selectedEquipment as keyof typeof equipmentRates].baseRate * duration}</span>
                    </div>
                    {includeFuel && (
                      <div className="flex justify-between">
                        <span>Fuel ({duration} hours)</span>
                        <span>₹{equipmentRates[selectedEquipment as keyof typeof equipmentRates].fuelRate * duration}</span>
                      </div>
                    )}
                    {includeOperator && (
                      <div className="flex justify-between">
                        <span>Operator ({duration} hours)</span>
                        <span>₹{equipmentRates[selectedEquipment as keyof typeof equipmentRates].operatorRate * duration}</span>
                      </div>
                    )}
                    <hr className="my-2" />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-green-600">₹{calculateTotal()}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-gradient-to-r from-yellow-500 to-cyan-500 hover:from-yellow-600 hover:to-cyan-600">
                    Book Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Plans */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative bg-white/60 backdrop-blur-md border-white/30 shadow-xl ${plan.popular ? 'ring-2 ring-yellow-500' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-cyan-500 text-white">
                    Most Popular
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-center">
                    <div className={`text-2xl font-bold bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}>
                      {plan.name}
                    </div>
                    <div className="text-3xl font-bold text-gray-800 mt-2">{plan.price}</div>
                    <p className="text-gray-600 mt-2">{plan.description}</p>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/auth">
                    <Button className={`w-full ${plan.popular ? 'bg-gradient-to-r from-yellow-500 to-cyan-500 hover:from-yellow-600 hover:to-cyan-600' : ''}`}>
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Features */}
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/60 backdrop-blur-md border-white/30 shadow-xl text-center">
              <CardContent className="p-6">
                <Clock className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Flexible Billing</h3>
                <p className="text-gray-600">Pay only for the hours you use. No hidden charges or minimum commitments.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/60 backdrop-blur-md border-white/30 shadow-xl text-center">
              <CardContent className="p-6">
                <Shield className="h-12 w-12 text-cyan-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Full Insurance</h3>
                <p className="text-gray-600">All equipment comes with comprehensive insurance coverage for your peace of mind.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/60 backdrop-blur-md border-white/30 shadow-xl text-center">
              <CardContent className="p-6">
                <Phone className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
                <p className="text-gray-600">Round-the-clock support to assist you whenever you need help.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Pricing;
