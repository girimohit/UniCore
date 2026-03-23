"use client";

import { useState } from "react";
import { SYSTEM_MODULES, ModuleMetadata } from "@/lib/modules/registry";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Box, Settings2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModuleManagerProps {
  initialModules: ModuleMetadata[];
}

export default function ModuleManager({ initialModules }: ModuleManagerProps) {
  const [activeModules, setActiveModules] = useState<string[]>(initialModules.map(m => m.id));
  const [loading, setLoading] = useState<string | null>(null);

  const toggleModule = async (moduleId: string, isEnabled: boolean) => {
    setLoading(moduleId);
    try {
      const response = await fetch("/api/admin/modules/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId, isEnabled }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setActiveModules(prev => 
        isEnabled ? [...prev, moduleId] : prev.filter(id => id !== moduleId)
      );
      toast.success(`${SYSTEM_MODULES[moduleId].name} ${isEnabled ? "enabled" : "disabled"} successfully`);
      
      // Optionally refresh page to update sidebar/layouts
      // router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to toggle module");
    } finally {
      setLoading(null);
    }
  };

  const allModules = Object.values(SYSTEM_MODULES);
  const coreModules = allModules.filter(m => m.type === 'CORE');
  const optionalModules = allModules.filter(m => m.type === 'OPTIONAL');

  return (
    <Card className="border-border/40 bg-card/50 backdrop-blur-sm shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Box className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-xl">Module Management</CardTitle>
            <CardDescription>Enable or disable optional system features</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <section>
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
            <Settings2 className="w-4 h-4" />
            Core Modules
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coreModules.map(module => (
              <div 
                key={module.id} 
                className="flex items-center justify-between p-4 rounded-xl border border-border/20 bg-muted/30 opacity-80"
              >
                <div className="flex gap-3 items-center">
                  <div className="p-2 rounded-lg bg-background text-muted-foreground">
                    <Info className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{module.name}</p>
                    <p className="text-xs text-muted-foreground">{module.description}</p>
                  </div>
                </div>
                <div className="text-[10px] font-black bg-primary/10 text-primary px-2 py-1 rounded uppercase">System</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
            <Box className="w-4 h-4" />
            Optional Modules
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {optionalModules.map(module => {
              const isEnabled = activeModules.includes(module.id);
              const isLoading = loading === module.id;

              return (
                <div 
                  key={module.id} 
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border transition-all duration-300",
                    isEnabled ? "border-primary/30 bg-primary/5" : "border-border/20 bg-card"
                  )}
                >
                  <div className="flex gap-3 items-center">
                    <div className={cn(
                      "p-2 rounded-lg transition-colors",
                      isEnabled ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}>
                      <Box className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{module.name}</p>
                      <p className="text-xs text-muted-foreground">{module.description}</p>
                    </div>
                  </div>
                  <Switch 
                    checked={isEnabled} 
                    disabled={isLoading}
                    onCheckedChange={(checked: boolean) => toggleModule(module.id, checked)}
                  />
                </div>
              );
            })}
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
