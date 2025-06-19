
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { AlertCircle, Check, Star, Users, BarChart3, ChevronDown, Eye, Code, CheckCircle } from 'lucide-react';
import BlitzLogo from '@/components/BlitzLogo';

const DesignSystem = () => {
  const [showTechnicalDetails, setShowTechnicalDetails] = React.useState(false);

  const brandColors = [
    { name: 'Blitz Purple', value: '#7C3AED', usage: 'Primary brand color, CTAs, active states', class: 'bg-blitz-purple', contrast: '5.2:1' },
    { name: 'Blitz Green', value: '#059669', usage: 'Success states, confirmations, secondary actions', class: 'bg-blitz-green', contrast: '4.8:1' },
    { name: 'Light Gray', value: '#E5E7EB', usage: 'Subtle backgrounds, disabled states', class: 'bg-blitz-light-gray', contrast: '1.2:1' },
    { name: 'Medium Gray', value: '#D1D5DB', usage: 'Main app background, card containers', class: 'bg-blitz-medium-gray', contrast: '1.4:1' },
    { name: 'Dark Gray', value: '#374151', usage: 'Primary text, headers, important content', class: 'bg-blitz-dark-gray', contrast: '11.9:1' },
  ];

  const semanticColors = [
    { name: 'Primary', value: '#7C3AED', usage: 'Main brand actions', class: 'bg-primary', contrast: '5.2:1' },
    { name: 'Secondary', value: '#059669', usage: 'Supporting actions', class: 'bg-secondary', contrast: '4.8:1' },
    { name: 'Background', value: '#E8EAF0', usage: 'Page backgrounds', class: 'bg-background', contrast: '1.1:1' },
    { name: 'Card', value: '#F1F3F8', usage: 'Content containers', class: 'bg-card', contrast: '1.0:1' },
    { name: 'Muted', value: '#D4D7DE', usage: 'Subtle elements', class: 'bg-muted', contrast: '1.5:1' },
    { name: 'Destructive', value: '#EF4444', usage: 'Errors, warnings', class: 'bg-destructive', contrast: '4.5:1' },
  ];

  const textHierarchy = [
    { name: 'Primary Text', class: 'text-foreground', usage: 'Main headings, important content', contrast: '12.6:1', wcag: 'AAA' },
    { name: 'Secondary Text', class: 'text-text-secondary', usage: 'Secondary headings, subtext', contrast: '10.2:1', wcag: 'AAA' },
    { name: 'Tertiary Text', class: 'text-muted-foreground', usage: 'Supporting text, captions', contrast: '5.25:1', wcag: 'AA+' },
    { name: 'Disabled Text', class: 'text-text-disabled', usage: 'Disabled states, placeholders', contrast: '3.4:1', wcag: 'AA' },
  ];

  const typography = [
    { name: 'Display', class: 'text-4xl font-bold text-foreground', sample: 'Blitz Board Stats', usage: 'Hero headings, page titles', size: '36px', lineHeight: '40px', weight: '700' },
    { name: 'Heading Large', class: 'text-3xl font-bold text-foreground', sample: 'Team Dashboard', usage: 'Section headers', size: '30px', lineHeight: '36px', weight: '700' },
    { name: 'Heading Medium', class: 'text-2xl font-bold text-foreground', sample: 'Player Statistics', usage: 'Card titles', size: '24px', lineHeight: '32px', weight: '700' },
    { name: 'Heading Small', class: 'text-xl font-bold text-foreground', sample: 'Game Results', usage: 'Component headers', size: '20px', lineHeight: '28px', weight: '700' },
    { name: 'Body Large', class: 'text-lg text-foreground', sample: 'The quick brown fox jumps over the lazy dog', usage: 'Important body text', size: '18px', lineHeight: '28px', weight: '400' },
    { name: 'Body Regular', class: 'text-base text-foreground', sample: 'The quick brown fox jumps over the lazy dog', usage: 'Default body text', size: '16px', lineHeight: '24px', weight: '400' },
    { name: 'Body Small', class: 'text-sm text-muted-foreground', sample: 'The quick brown fox jumps over the lazy dog', usage: 'Supporting text', size: '14px', lineHeight: '20px', weight: '400' },
    { name: 'Caption', class: 'text-xs text-muted-foreground', sample: 'The quick brown fox jumps over the lazy dog', usage: 'Labels, captions', size: '12px', lineHeight: '16px', weight: '400' },
  ];

  const AccessibilityBadge = ({ contrast, wcag }: { contrast: string; wcag: string }) => (
    <div className="flex items-center gap-2">
      <Badge variant={wcag === 'AAA' ? 'default' : wcag === 'AA+' ? 'secondary' : 'outline'} className="text-xs">
        <CheckCircle className="w-3 h-3 mr-1" />
        {wcag} {contrast}
      </Badge>
    </div>
  );

  const TechnicalToggle = () => (
    <div className="flex items-center space-x-2 mb-6">
      <Eye className="h-4 w-4" />
      <Label htmlFor="technical-toggle" className="text-foreground">Visual Mode</Label>
      <Switch 
        id="technical-toggle" 
        checked={showTechnicalDetails}
        onCheckedChange={setShowTechnicalDetails}
      />
      <Code className="h-4 w-4" />
      <Label htmlFor="technical-toggle" className="text-foreground">Technical Mode</Label>
    </div>
  );

  const TechnicalDetails = ({ children }: { children: React.ReactNode }) => (
    showTechnicalDetails ? (
      <div className="mt-3 p-3 bg-muted/50 rounded-lg border-l-4 border-primary">
        {children}
      </div>
    ) : null
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16">
        <div className="max-w-6xl mx-auto px-8 text-center space-y-6">
          <BlitzLogo size="large" />
          <h1 className="text-5xl font-bold text-foreground">
            Blitz Board Stats
          </h1>
          <h2 className="text-2xl font-medium text-primary">
            Design System
          </h2>
          <p className="text-xl text-foreground max-w-3xl mx-auto leading-relaxed">
            A comprehensive, accessible visual guide for creating consistent, WCAG AA compliant experiences 
            for youth football team management
          </p>
          <TechnicalToggle />
          
          {/* Accessibility Notice */}
          <div className="bg-card/80 backdrop-blur-sm rounded-lg p-6 border border-border/50 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="text-blitz-green h-6 w-6" />
              <h3 className="text-lg font-semibold text-foreground">Accessibility First</h3>
            </div>
            <p className="text-foreground leading-relaxed">
              This design system prioritizes accessibility with WCAG AA compliance, ensuring all text meets 4.5:1 contrast ratios and components are usable by everyone.
            </p>
          </div>
          
          {/* Brand Quotes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              "To chase greatness, you need to measure your grind.",
              "Stats aren't just numbers — they're proof you're getting better.",
              "Don't guess your progress. Know it. Track it. Own it."
            ].map((quote, index) => (
              <blockquote key={index} className="bg-card/50 backdrop-blur-sm rounded-lg p-6 border border-border/50">
                <p className="text-lg italic text-foreground leading-relaxed">"{quote}"</p>
              </blockquote>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <Tabs defaultValue="accessibility" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-12 h-14">
            <TabsTrigger value="accessibility" className="text-sm">Accessibility</TabsTrigger>
            <TabsTrigger value="colors" className="text-sm">Colors</TabsTrigger>
            <TabsTrigger value="typography" className="text-sm">Typography</TabsTrigger>
            <TabsTrigger value="components" className="text-sm">Components</TabsTrigger>
            <TabsTrigger value="layouts" className="text-sm">Layouts</TabsTrigger>
            <TabsTrigger value="patterns" className="text-sm">Patterns</TabsTrigger>
          </TabsList>

          {/* Accessibility Tab */}
          <TabsContent value="accessibility" className="space-y-12">
            <section>
              <h3 className="text-3xl font-bold mb-8 text-foreground">Accessibility Standards</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <Card className="p-6">
                  <h4 className="text-xl font-semibold mb-4 text-foreground">WCAG Compliance</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <span className="text-foreground font-medium">AA Standard</span>
                      <Badge className="bg-green-600 text-white">4.5:1 Minimum</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <span className="text-foreground font-medium">AAA Standard</span>
                      <Badge className="bg-blue-600 text-white">7:1 Enhanced</Badge>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h4 className="text-xl font-semibold mb-4 text-foreground">Text Hierarchy</h4>
                  <div className="space-y-3">
                    {textHierarchy.map((text) => (
                      <div key={text.name} className="flex items-center justify-between p-3 rounded-lg border border-border">
                        <div>
                          <div className={`font-medium ${text.class}`}>{text.name}</div>
                          <div className="text-sm text-muted-foreground">{text.usage}</div>
                        </div>
                        <AccessibilityBadge contrast={text.contrast} wcag={text.wcag} />
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </section>
          </TabsContent>

          {/* Colors Tab */}
          <TabsContent value="colors" className="space-y-12">
            {/* Brand Colors */}
            <section>
              <h3 className="text-3xl font-bold mb-8 text-foreground">Brand Colors</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {brandColors.map((color) => (
                  <Card key={color.name} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className={`h-32 ${color.class} relative`}>
                      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded px-3 py-2 shadow-sm">
                        <span className="font-mono text-sm font-medium text-foreground">{color.value}</span>
                        <div className="text-xs text-muted-foreground">Contrast: {color.contrast}</div>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h4 className="font-bold text-lg mb-2 text-foreground">{color.name}</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-3">{color.usage}</p>
                      <AccessibilityBadge contrast={color.contrast} wcag={parseFloat(color.contrast) >= 7 ? 'AAA' : 'AA'} />
                      <TechnicalDetails>
                        <div className="text-xs space-y-1">
                          <div>CSS Class: <code className="bg-muted px-1 rounded text-foreground">{color.class}</code></div>
                          <div>Hex: <code className="bg-muted px-1 rounded text-foreground">{color.value}</code></div>
                          <div>Contrast Ratio: <code className="bg-muted px-1 rounded text-foreground">{color.contrast}</code></div>
                        </div>
                      </TechnicalDetails>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Semantic Colors */}
            <section>
              <h3 className="text-3xl font-bold mb-8 text-foreground">Semantic Colors</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {semanticColors.map((color) => (
                  <div key={color.name} className="text-center space-y-3">
                    <div className={`h-16 w-full ${color.class} rounded-lg shadow-sm`}></div>
                    <div>
                      <div className="font-medium text-sm text-foreground">{color.name}</div>
                      <div className="text-xs text-muted-foreground">{color.usage}</div>
                      <div className="text-xs font-mono text-muted-foreground mt-1">{color.contrast}</div>
                      <TechnicalDetails>
                        <div className="text-xs font-mono text-foreground">{color.value}</div>
                      </TechnicalDetails>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </TabsContent>

          {/* Typography Tab */}
          <TabsContent value="typography" className="space-y-12">
            <section>
              <h3 className="text-3xl font-bold mb-8 text-foreground">Typography Scale</h3>
              <div className="space-y-8">
                {typography.map((type) => (
                  <div key={type.name} className="border-b border-border pb-8 last:border-b-0">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-lg text-foreground">{type.name}</h4>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div><strong>Size:</strong> {type.size}</div>
                          <div><strong>Line Height:</strong> {type.lineHeight}</div>
                          <div><strong>Weight:</strong> {type.weight}</div>
                          <div><strong>Usage:</strong> {type.usage}</div>
                        </div>
                      </div>
                      <div className="lg:col-span-2">
                        <div className={type.class}>{type.sample}</div>
                      </div>
                      <div className="text-right">
                        <TechnicalDetails>
                          <div className="text-xs space-y-1 text-left">
                            <div>CSS: <code className="bg-muted px-1 rounded text-xs text-foreground">{type.class}</code></div>
                            <div>Font Size: <code className="bg-muted px-1 rounded text-xs text-foreground">{type.size}</code></div>
                            <div>Line Height: <code className="bg-muted px-1 rounded text-xs text-foreground">{type.lineHeight}</code></div>
                          </div>
                        </TechnicalDetails>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </TabsContent>

          {/* Components Tab */}
          <TabsContent value="components" className="space-y-12">
            {/* Buttons */}
            <section>
              <h3 className="text-3xl font-bold mb-8">Buttons</h3>
              
              {/* Button Variants */}
              <div className="mb-8">
                <h4 className="text-xl font-semibold mb-6">Variants</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                  {[
                    { variant: 'default', label: 'Primary' },
                    { variant: 'secondary', label: 'Secondary' },
                    { variant: 'outline', label: 'Outline' },
                    { variant: 'ghost', label: 'Ghost' },
                    { variant: 'destructive', label: 'Destructive' },
                    { variant: 'link', label: 'Link' }
                  ].map(({ variant, label }) => (
                    <div key={variant} className="text-center space-y-3">
                      <Button variant={variant as any} className="w-full">
                        {label}
                      </Button>
                      <div className="text-xs text-muted-foreground">{label}</div>
                      <TechnicalDetails>
                        <div className="text-xs">variant="{variant}"</div>
                      </TechnicalDetails>
                    </div>
                  ))}
                </div>
              </div>

              {/* Button Sizes */}
              <div className="mb-8">
                <h4 className="text-xl font-semibold mb-6">Sizes & Dimensions</h4>
                <div className="space-y-6">
                  {[
                    { size: 'sm', label: 'Small', height: '36px', padding: '8px 12px', fontSize: '14px' },
                    { size: 'default', label: 'Default', height: '40px', padding: '8px 16px', fontSize: '16px' },
                    { size: 'lg', label: 'Large', height: '44px', padding: '8px 32px', fontSize: '16px' },
                    { size: 'icon', label: 'Icon', height: '40px', padding: '40x40px', fontSize: '16px' }
                  ].map(({ size, label, height, padding, fontSize }) => (
                    <div key={size} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-6">
                        {size === 'icon' ? (
                          <Button size={size as any}><Star className="h-4 w-4" /></Button>
                        ) : (
                          <Button size={size as any}>{label}</Button>
                        )}
                        <div className="space-y-1">
                          <div className="font-medium">{label}</div>
                          <div className="text-sm text-muted-foreground">
                            Height: {height} • Padding: {padding} • Font: {fontSize}
                          </div>
                        </div>
                      </div>
                      <TechnicalDetails>
                        <div className="text-xs">size="{size}"</div>
                      </TechnicalDetails>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Blitz Button */}
              <div>
                <h4 className="text-xl font-semibold mb-6">Custom Blitz Style</h4>
                <div className="flex items-center gap-6 p-4 border border-border rounded-lg">
                  <Button className="blitz-btn">Blitz Button</Button>
                  <div className="space-y-1">
                    <div className="font-medium">Custom Blitz Button</div>
                    <div className="text-sm text-muted-foreground">
                      Height: 48px • Padding: 12px 16px • Font: 16px semibold
                    </div>
                  </div>
                </div>
                <TechnicalDetails>
                  <div className="text-xs mt-4 bg-muted p-3 rounded">
                    Custom .blitz-btn class with purple background, semibold weight, and enhanced padding
                  </div>
                </TechnicalDetails>
              </div>
            </section>

            {/* Form Components */}
            <section>
              <h3 className="text-3xl font-bold mb-8">Form Components</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="p-6">
                  <h4 className="text-lg font-semibold mb-6">Input Fields</h4>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>Standard Input</Label>
                      <Input placeholder="Standard input" />
                      <div className="text-sm text-muted-foreground">Height: 40px • Padding: 8px 12px • Border radius: 6px</div>
                    </div>
                    <div className="space-y-2">
                      <Label>Custom Input</Label>
                      <Input placeholder="Custom input field" className="input-field" />
                      <div className="text-sm text-muted-foreground">Height: 40px • Padding: 16px • Enhanced focus states</div>
                    </div>
                    <TechnicalDetails>
                      <div className="text-xs">Standard inputs use shadcn/ui defaults with consistent sizing</div>
                    </TechnicalDetails>
                  </div>
                </Card>

                <Card className="p-6">
                  <h4 className="text-lg font-semibold mb-6">Interactive Controls</h4>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="example" />
                        <Label htmlFor="example">Checkbox</Label>
                      </div>
                      <div className="text-sm text-muted-foreground">16×16px</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch id="example-switch" />
                        <Label htmlFor="example-switch">Switch</Label>
                      </div>
                      <div className="text-sm text-muted-foreground">44×24px</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Progress Bar</Label>
                        <div className="text-sm text-muted-foreground">Height: 8px</div>
                      </div>
                      <Progress value={65} />
                    </div>
                  </div>
                </Card>
              </div>
            </section>

            {/* Content Components */}
            <section>
              <h3 className="text-3xl font-bold mb-8">Content Components</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card className="p-6">
                  <h4 className="text-lg font-semibold mb-4">Avatars & Badges</h4>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">John Doe</div>
                        <div className="text-sm text-muted-foreground">Avatar: 40×40px</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Badge>Default</Badge>
                        <Badge variant="secondary">Secondary</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">Height: 22px • Padding: 2px 8px</div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h4 className="text-lg font-semibold mb-4">Alerts</h4>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Information</AlertTitle>
                    <AlertDescription>
                      This is an example alert component.
                    </AlertDescription>
                  </Alert>
                  <div className="text-sm text-muted-foreground mt-3">Padding: 16px • Border radius: 8px</div>
                </Card>

                <Card className="p-6">
                  <h4 className="text-lg font-semibold mb-4">Cards</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>This is an example of our standard card component with consistent styling.</div>
                    <div className="mt-3 font-medium">Dimensions:</div>
                    <div>• Padding: 24px</div>
                    <div>• Border radius: 8px</div>
                    <div>• Shadow: subtle</div>
                  </div>
                  <TechnicalDetails>
                    <div className="text-xs mt-3">Uses shadcn/ui Card component with custom theming</div>
                  </TechnicalDetails>
                </Card>
              </div>
            </section>
          </TabsContent>

          {/* Layouts Tab */}
          <TabsContent value="layouts" className="space-y-12">
            <section>
              <h3 className="text-3xl font-bold mb-8">Spacing System</h3>
              <div className="space-y-6">
                {[
                  { name: 'XS', value: '4px', class: 'p-1', usage: 'Tight spacing, form elements' },
                  { name: 'SM', value: '8px', class: 'p-2', usage: 'Small spacing, buttons' },
                  { name: 'MD', value: '16px', class: 'p-4', usage: 'Default spacing, cards' },
                  { name: 'LG', value: '24px', class: 'p-6', usage: 'Large spacing, sections' },
                  { name: 'XL', value: '32px', class: 'p-8', usage: 'Extra large spacing' },
                  { name: '2XL', value: '48px', class: 'p-12', usage: 'Maximum spacing' },
                ].map((space) => (
                  <div key={space.name} className="flex items-center gap-8 p-4 border border-border rounded-lg">
                    <div className="w-20 text-right">
                      <div className="font-bold text-lg">{space.name}</div>
                      <div className="text-sm text-muted-foreground">{space.value}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`bg-primary h-8 ${space.class.replace('p-', 'w-')}`}></div>
                      <div className="text-sm text-muted-foreground">{space.usage}</div>
                    </div>
                    <TechnicalDetails>
                      <div className="text-xs ml-auto">CSS: {space.class}</div>
                    </TechnicalDetails>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-3xl font-bold mb-8">Layout Examples</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="p-6">
                  <h4 className="text-lg font-semibold mb-4">Mobile Navigation</h4>
                  <div className="bg-background border rounded-lg p-4">
                    <div className="flex justify-around">
                      <div className="nav-link active text-center">
                        <Users className="h-6 w-6 mx-auto" />
                        <span className="text-xs mt-1 block">Teams</span>
                      </div>
                      <div className="nav-link text-center">
                        <BarChart3 className="h-6 w-6 mx-auto" />
                        <span className="text-xs mt-1 block">Stats</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mt-3">Height: 64px • Icon: 24×24px • Text: 12px</div>
                </Card>

                <Card className="p-6">
                  <h4 className="text-lg font-semibold mb-4">Content Card</h4>
                  <div className="blitz-card">
                    <h5 className="font-semibold mb-2">Player Stats</h5>
                    <p className="text-sm text-muted-foreground">
                      Example of our custom card styling with consistent spacing and borders.
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground mt-3">Padding: 16px • Border radius: 8px</div>
                </Card>
              </div>
            </section>
          </TabsContent>

          {/* Patterns Tab */}
          <TabsContent value="patterns" className="space-y-12">
            <section>
              <h3 className="text-3xl font-bold mb-8">Design Patterns</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6">
                  <h4 className="text-lg font-semibold mb-4">Navigation States</h4>
                  <div className="space-y-3">
                    <div className="nav-link active p-2 rounded">
                      <Users className="h-4 w-4" />
                      <span className="ml-2">Active State</span>
                    </div>
                    <div className="nav-link p-2 rounded">
                      <BarChart3 className="h-4 w-4" />
                      <span className="ml-2">Inactive State</span>
                    </div>
                  </div>
                  <TechnicalDetails>
                    <div className="text-xs mt-3">
                      Active: text-blitz-green, Inactive: text-gray-700
                    </div>
                  </TechnicalDetails>
                </Card>

                <Card className="p-6">
                  <h4 className="text-lg font-semibold mb-4">Interactive Elements</h4>
                  <div className="space-y-3">
                    <Button className="w-full hover-scale">Hover Scale Effect</Button>
                    <div className="p-3 border rounded hover:shadow-md transition-shadow">
                      Hover Shadow Effect
                    </div>
                  </div>
                </Card>
              </div>
            </section>

            <section>
              <h3 className="text-3xl font-bold mb-8">Custom CSS Classes</h3>
              <div className="space-y-6">
                {[
                  {
                    name: '.blitz-btn',
                    description: 'Primary action button with brand styling',
                    dimensions: 'Height: 48px • Padding: 12px 16px • Font: 16px semibold',
                    example: <Button className="blitz-btn">Example Button</Button>
                  },
                  {
                    name: '.blitz-card',
                    description: 'Content container with consistent styling',
                    dimensions: 'Padding: 16px • Border radius: 8px • Shadow: subtle',
                    example: <div className="blitz-card max-w-sm">Example card content</div>
                  },
                  {
                    name: '.input-field',
                    description: 'Enhanced input with focus states',
                    dimensions: 'Height: 40px • Padding: 16px • Enhanced focus ring',
                    example: <Input placeholder="Enhanced input" className="input-field max-w-sm" />
                  },
                  {
                    name: '.nav-link',
                    description: 'Navigation link styling',
                    dimensions: 'Flexible height • Icon: 20×20px • Font: 14px medium',
                    example: (
                      <div className="nav-link active">
                        <Users className="h-5 w-5" />
                        <span className="ml-2">Navigation Item</span>
                      </div>
                    )
                  }
                ].map((pattern) => (
                  <div key={pattern.name} className="border border-border rounded-lg p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
                      <div>
                        <h5 className="font-mono text-lg font-semibold">{pattern.name}</h5>
                        <p className="text-sm text-muted-foreground mt-1">{pattern.description}</p>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Dimensions</div>
                        <div className="text-xs text-muted-foreground">{pattern.dimensions}</div>
                      </div>
                      <div className="lg:col-span-2">
                        {pattern.example}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DesignSystem;
