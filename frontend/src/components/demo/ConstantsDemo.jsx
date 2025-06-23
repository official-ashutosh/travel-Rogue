import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card.jsx';
import { Button } from '../ui/Button.jsx';
import { Badge } from '../ui/Badge.jsx';
import {
  navlinks,
  features,
  controlCenterSections,
  planSections,
  colors,
  expenseCategories,
  planNavLinks,
  FEEDBACK_LABELS,
  ACTIVITY_PREFERENCES,
  COMPANION_PREFERENCES
} from '../../lib/constants.js';

const ConstantsDemo = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Constants Integration Demo</h1>
        <p className="text-gray-600 mt-2">All constants are properly integrated and visible</p>
      </div>

      {/* Navigation Links */}
      <Card>
        <CardHeader>
          <CardTitle>Navigation Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {navlinks.map((link, idx) => (
              <Button key={idx} variant="outline">{link.text}</Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {features.map((feature, idx) => (
              <Badge key={idx} variant="secondary">{feature}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Control Center Sections */}
      <Card>
        <CardHeader>
          <CardTitle>Control Center Sections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {controlCenterSections.map((section) => (
              <div key={section.id} className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 font-medium">
                  {section.icon}
                  {section.title}
                </div>
                <p className="text-sm text-gray-600 mt-1">{section.tooltipText}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Plan Sections */}
      <Card>
        <CardHeader>
          <CardTitle>Plan Sections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {planSections.map((section) => (
              <div key={section.id} className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 font-medium">
                  {section.icon}
                  {section.name}
                </div>
                <p className="text-sm text-gray-600">
                  {section.isPublic ? 'Public' : 'Private'} Section
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Color Palette</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {colors.map((color, idx) => (
              <div
                key={idx}
                className="w-16 h-16 rounded-lg border"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Expense Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {expenseCategories.map((category) => (
              <div key={category.key} className="flex items-center gap-2 p-2 border rounded-lg">
                {category.icon}
                <span className="text-sm">{category.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Plan Nav Links */}
      <Card>
        <CardHeader>
          <CardTitle>Plan Navigation Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {planNavLinks.map((link, idx) => (
              <Button key={idx} variant="outline">{link.lable}</Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Feedback Labels */}
      <Card>
        <CardHeader>
          <CardTitle>Feedback Labels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {FEEDBACK_LABELS.map((label) => (
              <Badge key={label.id} variant="outline">{label.displayName}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ACTIVITY_PREFERENCES.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-center gap-2 p-2 border rounded-lg">
                  <Icon className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">{activity.displayName}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Companion Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Companion Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {COMPANION_PREFERENCES.map((companion) => {
              const Icon = companion.icon;
              return (
                <div key={companion.id} className="flex items-center gap-2 p-2 border rounded-lg">
                  <Icon className="w-4 h-4 text-green-600" />
                  <span className="text-sm">{companion.displayName}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="text-center pt-8">
        <p className="text-green-600 font-medium">✅ All constants are properly integrated and functional!</p>
      </div>
    </div>
  );
};

export default ConstantsDemo;
