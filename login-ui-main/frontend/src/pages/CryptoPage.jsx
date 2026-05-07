import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Coins, Network, TrendingUp, Search, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cryptoService } from "@/services/cryptoService";
import { toast } from "@/components/ui/sonner";

export default function CryptoPage() {
  const [activeTab, setActiveTab] = useState("chains");
  const [chains, setChains] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [chainSettings, setChainSettings] = useState({});
  const [transferDialog, setTransferDialog] = useState({ open: false, chain: null });
  const [transferData, setTransferData] = useState({ network: "", address: "", amount: "", type: "" });

  const defaultChains = [
    { id: 1, chain: "BNB", token: "USDT", type: "BEP20", balance: "$4.79", amount: "0.0598 BNB", deposit: true, withdraw: true, status: "Operational" },
    { id: 2, chain: "ETH", token: "USDT", type: "ERC20", balance: "$0.00", amount: "0.0000 ETH", deposit: true, withdraw: true, status: "Operational" },
    { id: 3, chain: "POL", token: "USDT", type: "POLYGON", balance: "$0.00", amount: "0.0000 MATIC", deposit: false, withdraw: false, status: "Operational" },
    { id: 4, chain: "ARB", token: "USDT", type: "ARBITRUM", balance: "$0.00", amount: "0.0000 ETH", deposit: true, withdraw: true, status: "Operational" },
    { id: 5, chain: "BA", token: "USDT", type: "BASE", balance: "$0.00", amount: "0.0000 ETH", deposit: true, withdraw: true, status: "Operational" },
    { id: 6, chain: "AV", token: "USDT", type: "AVALANCHE", balance: "$0.00", amount: "0.0000 AVAX", deposit: true, withdraw: true, status: "Operational" },
    { id: 7, chain: "OP", token: "USDT", type: "OPTIMISM", balance: "$0.00", amount: "0.0000 ETH", deposit: true, withdraw: true, status: "Operational" },
    { id: 8, chain: "TRX", token: "USDT", type: "TRC20", balance: "$1,398.00", amount: "42.1259 TRX", deposit: true, withdraw: true, status: "Operational" },
  ];

  const fetchCryptoData = useCallback(async () => {
    try {
      setLoading(true);
      const [chainsData, walletsData, txData, opsData] = await Promise.allSettled([
        cryptoService.getChainsWallets({ search: searchTerm, type: "chains" }).catch(() => ({ chains: [] })),
        cryptoService.getChainsWallets({ search: searchTerm, type: "wallets" }).catch(() => ({ wallets: [] })),
        cryptoService.getTransactions({ search: searchTerm }).catch(() => ({ transactions: [] })),
        cryptoService.getOperations({ search: searchTerm }).catch(() => ({ operations: [] })),
      ]);

      const displayChains = chainsData?.value?.chains?.length ? chainsData.value.chains : defaultChains;
      setChains(displayChains);
      setWallets(walletsData?.value?.wallets || []);
      setTransactions(txData?.value?.transactions || []);
      setOperations(opsData?.value?.operations || []);

      const initialSettings = {};
      displayChains.forEach(c => {
        initialSettings[c.id] = { deposit: c.deposit, withdraw: c.withdraw };
      });
      setChainSettings(initialSettings);
    } catch (error) {
      console.error("Failed to fetch crypto data:", error);
      setChains(defaultChains);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  useEffect(() => {
    fetchCryptoData();
  }, [fetchCryptoData]);

  const handleToggleDeposit = (chainId, enabled) => {
    setChainSettings(prev => ({
      ...prev,
      [chainId]: { ...prev[chainId], deposit: enabled }
    }));
    toast.success(`Deposit ${enabled ? "enabled" : "disabled"} for chain ${chainId}`);
  };

  const handleToggleWithdraw = (chainId, enabled) => {
    setChainSettings(prev => ({
      ...prev,
      [chainId]: { ...prev[chainId], withdraw: enabled }
    }));
    toast.success(`Withdraw ${enabled ? "enabled" : "disabled"} for chain ${chainId}`);
  };

  const handleTransferOpen = (chain) => {
    setTransferDialog({ open: true, chain });
    setTransferData({ network: chain.type, address: "", amount: "", type: "" });
  };

  const handleTransferSubmit = () => {
    if (transferData.type !== "SEND") {
      toast.error("Please type SEND to confirm");
      return;
    }
    toast.success(`Transfer initiated for ${transferDialog.chain.chain}`);
    setTransferDialog({ open: false, chain: null });
  };

  const getChainIcon = (chain) => {
    return chain === "TRX" ? "◉" : chain === "ETH" || chain === "ARB" || chain === "OP" ? "Ξ" : chain === "BNB" ? "⩀" : "●";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white tracking-tight">Crypto Management</h1>
          <p className="text-white/50 text-sm mt-1">Configure and monitor blockchain integrations</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl">
          <TabsTrigger value="chains" className="text-white data-[state=active]:bg-emerald-500/15 data-[state=active]:text-emerald-400 rounded-lg text-sm font-medium">
            Chains
          </TabsTrigger>
          <TabsTrigger value="wallets" className="text-white data-[state=active]:bg-emerald-500/15 data-[state=active]:text-emerald-400 rounded-lg text-sm font-medium">
            Wallets
          </TabsTrigger>
          <TabsTrigger value="transactions" className="text-white data-[state=active]:bg-emerald-500/15 data-[state=active]:text-emerald-400 rounded-lg text-sm font-medium">
            Transactions
          </TabsTrigger>
          <TabsTrigger value="operations" className="text-white data-[state=active]:bg-emerald-500/15 data-[state=active]:text-emerald-400 rounded-lg text-sm font-medium">
            Operations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chains" className="mt-6">
          <div className="mb-6">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                type="text"
                placeholder="Search chains..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl h-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {chains.map((chain) => (
              <div
                key={chain.id}
                className="group relative overflow-hidden rounded-3xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10"
              >
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 text-lg font-mono text-emerald-400">
                        {getChainIcon(chain.chain)}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-base">{chain.chain}</h3>
                        <p className="text-white/50 text-xs">{chain.type}</p>
                      </div>
                    </div>
                    <Switch
                      checked={chainSettings[chain.id]?.crypto ?? true}
                      onCheckedChange={(checked) => setChainSettings(prev => ({
                        ...prev,
                        [chain.id]: { ...prev[chain.id], crypto: checked }
                      }))}
                      className="data-[state=checked]:bg-emerald-500"
                    />
                  </div>

                  <div className="mb-4">
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Token Balance</p>
                    <p className="text-white/90 font-semibold text-lg">{chain.balance} <span className="text-white/50 text-xs font-normal">{chain.amount}</span></p>
                  </div>

                  <div className="border-t border-white/10 pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-sm">Deposit</span>
                      <Switch
                        checked={chainSettings[chain.id]?.deposit ?? chain.deposit}
                        onCheckedChange={(checked) => handleToggleDeposit(chain.id, checked)}
                        className="data-[state=checked]:bg-emerald-500"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-sm">Withdraw</span>
                      <Switch
                        checked={chainSettings[chain.id]?.withdraw ?? chain.withdraw}
                        onCheckedChange={(checked) => handleToggleWithdraw(chain.id, checked)}
                        className="data-[state=checked]:bg-emerald-500"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10 rounded-xl">
                        Deposit Wallet
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10 rounded-xl" onClick={() => handleTransferOpen(chain)}>
                        Operational
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Dialog open={transferDialog.open} onOpenChange={(open) => setTransferDialog({ ...transferDialog, open })}>
            <DialogContent className="bg-gray-900 border border-white/10 rounded-3xl max-w-md">
              <DialogHeader>
                <DialogTitle className="text-white">Transfer Out</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="text-white/90 font-medium">
                  Send USDT via {transferDialog.chain?.type} <span className="text-white/50 text-xs">(gas: {transferDialog.chain?.chain === "ETH" || transferDialog.chain?.chain === "ARB" || transferDialog.chain?.chain === "OP" || transferDialog.chain?.chain === "BA" ? "ETH" : transferDialog.chain?.chain === "BNB" ? "BNB" : transferDialog.chain?.chain === "TRX" ? "TRX" : "Native"})</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-white/60 text-xs mb-1">Network: <span className="text-emerald-400">{transferData.network}</span></p>
                  </div>
                  <div>
                    <label className="text-white/60 text-xs mb-1 block">Destination address</label>
                    <Input
                      value={transferData.address}
                      onChange={(e) => setTransferData({ ...transferData, address: e.target.value })}
                      className="bg-white/5 border-white/10 text-white rounded-xl"
                      placeholder="0x..."
                    />
                  </div>
                  <div>
                    <label className="text-white/60 text-xs mb-1 block">Amount (USDT)</label>
                    <Input
                      type="number"
                      value={transferData.amount}
                      onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })}
                      className="bg-white/5 border-white/10 text-white rounded-xl"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="text-white/60 text-xs mb-1 block">Type "SEND" to confirm</label>
                    <Input
                      value={transferData.type}
                      onChange={(e) => setTransferData({ ...transferData, type: e.target.value })}
                      className="bg-white/5 border-white/10 text-white rounded-xl"
                      placeholder="SEND"
                    />
                  </div>
                </div>
                <p className="text-white/40 text-xs pt-2">Transfers are irreversible. Double-check the chain and destination address.</p>
                <DialogFooter>
                  <Button onClick={handleTransferSubmit} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl">
                    Send
                  </Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="wallets">
          <Card className="glass-strong border-white/10 rounded-3xl">
            <CardContent className="p-8">
              <p className="text-white/50">Wallets configuration coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card className="glass-strong border-white/10 rounded-3xl">
            <CardContent className="p-8">
              <p className="text-white/50">Crypto transactions list coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operations">
          <Card className="glass-strong border-white/10 rounded-3xl">
            <CardContent className="p-8">
              <p className="text-white/50">Operations logs coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}